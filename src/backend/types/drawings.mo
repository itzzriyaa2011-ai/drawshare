import Common "common";
import Set "mo:core/Set";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type DrawingId = Common.DrawingId;

  // Internal type with mutable fields (not shared — used only inside lib/)
  public type DrawingInternal = {
    id : DrawingId;
    author : Common.UserId;
    var title : Text;
    var description : Text;
    imageBlob : Storage.ExternalBlob;
    var tags : [Text];
    likedBy : Set.Set<Common.UserId>;
    savedBy : Set.Set<Common.UserId>;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  // Shared (API) type — immutable, serializable
  public type Drawing = {
    id : DrawingId;
    author : Common.UserId;
    title : Text;
    description : Text;
    imageBlob : Storage.ExternalBlob;
    tags : [Text];
    likeCount : Nat;
    savedCount : Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateDrawingInput = {
    title : Text;
    description : Text;
    imageBlob : Storage.ExternalBlob;
    tags : [Text];
  };

  public type UpdateDrawingInput = {
    title : Text;
    description : Text;
    tags : [Text];
  };
};
