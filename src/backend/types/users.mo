import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserId = Common.UserId;

  // Internal type with mutable fields
  public type UserProfileInternal = {
    id : UserId;
    var displayName : Text;
    var bio : Text;
    var avatarBlob : ?Storage.ExternalBlob;
    var followerCount : Nat;
    var followingCount : Nat;
    var postCount : Nat;
    var isAnonymousByDefault : Bool;
    createdAt : Common.Timestamp;
  };

  // Shared (API) type — no var fields, no mutable containers
  public type UserProfile = {
    id : UserId;
    displayName : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
    followerCount : Nat;
    followingCount : Nat;
    postCount : Nat;
    isAnonymousByDefault : Bool;
    createdAt : Common.Timestamp;
  };

  public type UpdateProfileInput = {
    displayName : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
    isAnonymousByDefault : Bool;
  };
};
