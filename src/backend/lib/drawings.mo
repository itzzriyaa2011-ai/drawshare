import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/drawings";
import Common "../types/common";

module {
  public type State = {
    drawings : Map.Map<Common.DrawingId, Types.DrawingInternal>;
    var nextId : Common.DrawingId;
  };

  // 7 days in nanoseconds
  let sevenDaysNs : Int = 604_800_000_000_000;

  public func initState() : State {
    let state : State = {
      drawings = Map.empty<Common.DrawingId, Types.DrawingInternal>();
      var nextId = 0;
    };
    // Seed sample drawings
    _seedSamples(state);
    state;
  };

  func _seedSamples(state : State) {
    let samples : [(Text, Text, [Text])] = [
      ("Mountain Landscape", "A serene mountain scene with snow-capped peaks", ["landscape", "mountains", "nature"]),
      ("Abstract Geometry", "Bold geometric shapes in primary colors", ["abstract", "geometry", "colorful"]),
      ("Portrait Study", "A detailed pencil portrait study", ["portrait", "pencil", "realistic"]),
      ("Ocean Waves", "Crashing waves at sunset", ["ocean", "waves", "sunset"]),
      ("City Skyline", "A night cityscape with glowing lights", ["city", "skyline", "night"]),
      ("Floral Sketch", "Detailed botanical illustration of wildflowers", ["floral", "botanical", "sketch"]),
    ];
    let sampleAuthor = Principal.fromText("aaaaa-aa");
    for ((title, description, tags) in samples.vals()) {
      let id = state.nextId;
      state.nextId += 1;
      let now = Time.now();
      // Use a placeholder ExternalBlob (empty Blob) for seeded samples
      let placeholderBlob : Storage.ExternalBlob = "" : Blob;
      let drawing : Types.DrawingInternal = {
        id;
        author = sampleAuthor;
        var title;
        var description;
        imageBlob = placeholderBlob;
        var tags;
        likedBy = Set.empty<Common.UserId>();
        savedBy = Set.empty<Common.UserId>();
        createdAt = now;
        var updatedAt = now;
      };
      state.drawings.add(id, drawing);
    };
  };

  public func createDrawing(
    state : State,
    author : Common.UserId,
    input : Types.CreateDrawingInput,
  ) : Types.Drawing {
    let id = state.nextId;
    state.nextId += 1;
    let now = Time.now();
    let drawing : Types.DrawingInternal = {
      id;
      author;
      var title = input.title;
      var description = input.description;
      imageBlob = input.imageBlob;
      var tags = input.tags;
      likedBy = Set.empty<Common.UserId>();
      savedBy = Set.empty<Common.UserId>();
      createdAt = now;
      var updatedAt = now;
    };
    state.drawings.add(id, drawing);
    toPublic(drawing);
  };

  public func getDrawing(state : State, id : Common.DrawingId) : ?Types.Drawing {
    switch (state.drawings.get(id)) {
      case (?d) ?toPublic(d);
      case null null;
    };
  };

  public func updateDrawing(
    state : State,
    caller : Common.UserId,
    id : Common.DrawingId,
    input : Types.UpdateDrawingInput,
  ) : () {
    switch (state.drawings.get(id)) {
      case null Runtime.trap("Drawing not found");
      case (?drawing) {
        if (not Principal.equal(drawing.author, caller)) {
          Runtime.trap("Unauthorized: Only the author can edit this drawing");
        };
        drawing.title := input.title;
        drawing.description := input.description;
        drawing.tags := input.tags;
        drawing.updatedAt := Time.now();
      };
    };
  };

  public func deleteDrawing(state : State, caller : Common.UserId, id : Common.DrawingId) : () {
    switch (state.drawings.get(id)) {
      case null Runtime.trap("Drawing not found");
      case (?drawing) {
        if (not Principal.equal(drawing.author, caller)) {
          Runtime.trap("Unauthorized: Only the author can delete this drawing");
        };
        state.drawings.remove(id);
      };
    };
  };

  public func listDrawings(
    state : State,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Drawing> {
    let all = state.drawings.values()
      |> _.toArray()
      |> _.sort(func(a : Types.DrawingInternal, b : Types.DrawingInternal) : { #less; #equal; #greater } {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
      });
    _paginate(all, offset, limit);
  };

  public func listDrawingsByTag(
    state : State,
    tag : Text,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Drawing> {
    let tagLower = tag.toLower();
    let filtered = state.drawings.values()
      |> _.toArray()
      |> _.filter(func(d : Types.DrawingInternal) : Bool {
        d.tags.find(func(t : Text) : Bool { t.toLower() == tagLower }) != null
      })
      |> _.sort(func(a : Types.DrawingInternal, b : Types.DrawingInternal) : { #less; #equal; #greater } {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
      });
    _paginate(filtered, offset, limit);
  };

  public func searchDrawings(
    state : State,
    searchQuery : Text,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Drawing> {
    let queryLower = searchQuery.toLower();
    let filtered = state.drawings.values()
      |> _.toArray()
      |> _.filter(func(d : Types.DrawingInternal) : Bool {
        d.title.toLower().contains(#text queryLower) or
        d.author.toText().toLower().contains(#text queryLower)
      })
      |> _.sort(func(a : Types.DrawingInternal, b : Types.DrawingInternal) : { #less; #equal; #greater } {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
      });
    _paginate(filtered, offset, limit);
  };

  public func likeDrawing(state : State, caller : Common.UserId, id : Common.DrawingId) : () {
    switch (state.drawings.get(id)) {
      case null Runtime.trap("Drawing not found");
      case (?drawing) {
        drawing.likedBy.add(caller);
      };
    };
  };

  public func unlikeDrawing(state : State, caller : Common.UserId, id : Common.DrawingId) : () {
    switch (state.drawings.get(id)) {
      case null Runtime.trap("Drawing not found");
      case (?drawing) {
        drawing.likedBy.remove(caller);
      };
    };
  };

  public func getLikedBy(state : State, id : Common.DrawingId) : [Common.UserId] {
    switch (state.drawings.get(id)) {
      case null Runtime.trap("Drawing not found");
      case (?drawing) drawing.likedBy.toArray();
    };
  };

  public func saveDrawing(state : State, caller : Common.UserId, id : Common.DrawingId) : () {
    switch (state.drawings.get(id)) {
      case null Runtime.trap("Drawing not found");
      case (?drawing) {
        drawing.savedBy.add(caller);
      };
    };
  };

  public func unsaveDrawing(state : State, caller : Common.UserId, id : Common.DrawingId) : () {
    switch (state.drawings.get(id)) {
      case null Runtime.trap("Drawing not found");
      case (?drawing) {
        drawing.savedBy.remove(caller);
      };
    };
  };

  public func getSavedDrawings(
    state : State,
    caller : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Drawing> {
    let saved = state.drawings.values()
      |> _.toArray()
      |> _.filter(func(d : Types.DrawingInternal) : Bool {
        d.savedBy.contains(caller)
      })
      |> _.sort(func(a : Types.DrawingInternal, b : Types.DrawingInternal) : { #less; #equal; #greater } {
        if (a.createdAt > b.createdAt) #less
        else if (a.createdAt < b.createdAt) #greater
        else #equal
      });
    _paginate(saved, offset, limit);
  };

  public func getTrendingDrawings(state : State, limit : Nat) : [Types.Drawing] {
    let cutoff : Common.Timestamp = Time.now() - sevenDaysNs;
    let recent = state.drawings.values()
      |> _.toArray()
      |> _.filter(func(d : Types.DrawingInternal) : Bool {
        d.createdAt >= cutoff
      })
      |> _.sort(func(a : Types.DrawingInternal, b : Types.DrawingInternal) : { #less; #equal; #greater } {
        let aLikes = a.likedBy.size();
        let bLikes = b.likedBy.size();
        if (aLikes > bLikes) #less
        else if (aLikes < bLikes) #greater
        else #equal
      });
    let taken = recent.sliceToArray(0, limit);
    taken.map(func(d : Types.DrawingInternal) : Types.Drawing { toPublic(d) });
  };

  public func getSuggestedDrawings(
    state : State,
    caller : Common.UserId,
    limit : Nat,
  ) : [Types.Drawing] {
    // Collect tags from caller's saved drawings
    let savedTags = Set.empty<Text>();
    for ((_, d) in state.drawings.entries()) {
      if (d.savedBy.contains(caller)) {
        for (tag in d.tags.vals()) {
          savedTags.add(tag.toLower());
        };
      };
    };

    // If no saved drawings, fall back to most liked overall
    if (savedTags.isEmpty()) {
      let sorted = state.drawings.values()
        |> _.toArray()
        |> _.sort(func(a : Types.DrawingInternal, b : Types.DrawingInternal) : { #less; #equal; #greater } {
          let aLikes = a.likedBy.size();
          let bLikes = b.likedBy.size();
          if (aLikes > bLikes) #less
          else if (aLikes < bLikes) #greater
          else #equal
        });
      let taken = sorted.sliceToArray(0, limit);
      return taken.map(func(d : Types.DrawingInternal) : Types.Drawing { toPublic(d) });
    };

    // Score each drawing by tag overlap with saved tags, exclude caller's own and already-saved
    type Scored = { drawing : Types.DrawingInternal; score : Nat };
    let scored = state.drawings.values()
      |> _.toArray()
      |> _.filterMap(func(d : Types.DrawingInternal) : ?Scored {
        if (Principal.equal(d.author, caller) or d.savedBy.contains(caller)) {
          return null;
        };
        var score = 0;
        for (tag in d.tags.vals()) {
          if (savedTags.contains(tag.toLower())) {
            score += 1;
          };
        };
        if (score == 0) null
        else ?{ drawing = d; score };
      })
      |> _.sort(func(a : Scored, b : Scored) : { #less; #equal; #greater } {
        if (a.score > b.score) #less
        else if (a.score < b.score) #greater
        else #equal
      });

    let taken = scored.sliceToArray(0, limit);
    taken.map(func(s : Scored) : Types.Drawing { toPublic(s.drawing) });
  };

  public func toPublic(internal : Types.DrawingInternal) : Types.Drawing {
    {
      id = internal.id;
      author = internal.author;
      title = internal.title;
      description = internal.description;
      imageBlob = internal.imageBlob;
      tags = internal.tags;
      likeCount = internal.likedBy.size();
      savedCount = internal.savedBy.size();
      createdAt = internal.createdAt;
      updatedAt = internal.updatedAt;
    };
  };

  // Helper: paginate an array of DrawingInternal, converting to public Drawing
  func _paginate(items : [Types.DrawingInternal], offset : Nat, limit : Nat) : Common.Page<Types.Drawing> {
    let total = items.size();
    let slice = items.sliceToArray(offset, offset + limit);
    let publicItems = slice.map(func(d : Types.DrawingInternal) : Types.Drawing { toPublic(d) });
    { items = publicItems; total; offset; limit };
  };
};
