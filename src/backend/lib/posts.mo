import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Common "../types/common";
import Types "../types/posts";

module {
  public type State = {
    posts : Map.Map<Common.PostId, Types.PostInternal>;
    var nextId : Common.PostId;
  };

  public func initState() : State {
    {
      posts = Map.empty<Common.PostId, Types.PostInternal>();
      var nextId = 0;
    };
  };

  public func createPost(
    state : State,
    author : Common.UserId,
    input : Types.CreatePostInput,
  ) : Types.Post {
    let id = state.nextId;
    state.nextId += 1;
    let now = Time.now();
    let internal : Types.PostInternal = {
      id;
      author;
      var title = input.title;
      var caption = input.caption;
      imageBlob = input.imageBlob;
      var isAnonymous = input.isAnonymous;
      likedBy = Set.empty<Common.UserId>();
      savedBy = Set.empty<Common.UserId>();
      createdAt = now;
      var updatedAt = now;
    };
    state.posts.add(id, internal);
    toPublic(internal);
  };

  public func getPost(state : State, id : Common.PostId) : ?Types.Post {
    switch (state.posts.get(id)) {
      case (?internal) { ?toPublic(internal) };
      case null { null };
    };
  };

  public func deletePost(state : State, caller : Common.UserId, id : Common.PostId) : () {
    switch (state.posts.get(id)) {
      case (?post) {
        if (not Principal.equal(post.author, caller)) {
          Runtime.trap("Not authorized to delete this post");
        };
        state.posts.remove(id);
      };
      case null { Runtime.trap("Post not found") };
    };
  };

  public func listPosts(
    state : State,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Post> {
    let all = state.posts.values().toArray();
    let sorted = all.sort(func(a, b) {
      Int.compare(b.createdAt, a.createdAt)
    });
    let total = sorted.size();
    let items = sorted.sliceToArray(offset.toInt(), (offset + limit).toInt()).map(
      func(p) { toPublic(p) }
    );
    { items; total; offset; limit };
  };

  public func listPostsByAuthors(
    state : State,
    authorIds : [Common.UserId],
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Post> {
    let authorSet = Set.fromArray(authorIds);
    let filtered = state.posts.values().filter(
      func(p) { authorSet.contains(p.author) }
    ).toArray();
    let sorted = filtered.sort(func(a, b) {
      Int.compare(b.createdAt, a.createdAt)
    });
    let total = sorted.size();
    let items = sorted.sliceToArray(offset.toInt(), (offset + limit).toInt()).map(
      func(p) { toPublic(p) }
    );
    { items; total; offset; limit };
  };

  public func searchPosts(
    state : State,
    keyword : Text,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Post> {
    let lower = keyword.toLower();
    let filtered = state.posts.values().filter(
      func(p) {
        p.title.toLower().contains(#text lower) or p.caption.toLower().contains(#text lower)
      }
    ).toArray();
    let sorted = filtered.sort(func(a, b) {
      Int.compare(b.createdAt, a.createdAt)
    });
    let total = sorted.size();
    let items = sorted.sliceToArray(offset.toInt(), (offset + limit).toInt()).map(
      func(p) { toPublic(p) }
    );
    { items; total; offset; limit };
  };

  public func likePost(state : State, caller : Common.UserId, id : Common.PostId) : () {
    switch (state.posts.get(id)) {
      case (?post) { post.likedBy.add(caller) };
      case null { Runtime.trap("Post not found") };
    };
  };

  public func unlikePost(state : State, caller : Common.UserId, id : Common.PostId) : () {
    switch (state.posts.get(id)) {
      case (?post) { post.likedBy.remove(caller) };
      case null { Runtime.trap("Post not found") };
    };
  };

  public func getLikeCount(state : State, id : Common.PostId) : Nat {
    switch (state.posts.get(id)) {
      case (?post) { post.likedBy.size() };
      case null { 0 };
    };
  };

  public func savePost(state : State, caller : Common.UserId, id : Common.PostId) : () {
    switch (state.posts.get(id)) {
      case (?post) { post.savedBy.add(caller) };
      case null { Runtime.trap("Post not found") };
    };
  };

  public func unsavePost(state : State, caller : Common.UserId, id : Common.PostId) : () {
    switch (state.posts.get(id)) {
      case (?post) { post.savedBy.remove(caller) };
      case null { Runtime.trap("Post not found") };
    };
  };

  public func getSavedPosts(
    state : State,
    caller : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Types.Post> {
    let saved = state.posts.values().filter(
      func(p) { p.savedBy.contains(caller) }
    ).toArray();
    let sorted = saved.sort(func(a, b) {
      Int.compare(b.createdAt, a.createdAt)
    });
    let total = sorted.size();
    let items = sorted.sliceToArray(offset.toInt(), (offset + limit).toInt()).map(
      func(p) { toPublic(p) }
    );
    { items; total; offset; limit };
  };

  public func toPublic(internal : Types.PostInternal) : Types.Post {
    {
      id = internal.id;
      author = if (internal.isAnonymous) { null } else { ?internal.author };
      title = internal.title;
      caption = internal.caption;
      imageBlob = internal.imageBlob;
      isAnonymous = internal.isAnonymous;
      likeCount = internal.likedBy.size();
      savedCount = internal.savedBy.size();
      createdAt = internal.createdAt;
      updatedAt = internal.updatedAt;
    };
  };
};
