import Common "common";
import Set "mo:core/Set";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type PostId = Common.PostId;

  // Internal type with mutable fields (not shared — used only inside lib/)
  public type PostInternal = {
    id : PostId;
    author : Common.UserId;
    var title : Text;
    var caption : Text;
    imageBlob : Storage.ExternalBlob;
    var isAnonymous : Bool;
    likedBy : Set.Set<Common.UserId>;
    savedBy : Set.Set<Common.UserId>;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  // Shared (API) type — immutable, serializable
  // When isAnonymous is true, author is omitted from the public view
  public type Post = {
    id : PostId;
    // null when the post is anonymous
    author : ?Common.UserId;
    title : Text;
    caption : Text;
    imageBlob : Storage.ExternalBlob;
    isAnonymous : Bool;
    likeCount : Nat;
    savedCount : Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreatePostInput = {
    title : Text;
    caption : Text;
    imageBlob : Storage.ExternalBlob;
    isAnonymous : Bool;
  };
};
