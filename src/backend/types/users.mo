import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserId = Common.UserId;

  // Internal type with mutable fields
  public type UserProfileInternal = {
    id : UserId;
    var username : Text;
    var bio : Text;
    var avatarBlob : ?Storage.ExternalBlob;
    var followerCount : Nat;
    var followingCount : Nat;
    createdAt : Common.Timestamp;
  };

  // Shared (API) type — no var fields, no mutable containers
  public type UserProfile = {
    id : UserId;
    username : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
    followerCount : Nat;
    followingCount : Nat;
    createdAt : Common.Timestamp;
  };

  public type UpdateProfileInput = {
    username : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
  };
};
