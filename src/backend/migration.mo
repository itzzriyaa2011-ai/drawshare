import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";

module {
  // ── Old types (copied from .old/src/backend/ — do NOT import from .old/) ──

  type OldUserId = Principal;
  type OldTimestamp = Int;
  type OldBlob = Blob;

  type OldUserProfileInternal = {
    id : OldUserId;
    var username : Text;
    var bio : Text;
    var avatarBlob : ?OldBlob;
    var followerCount : Nat;
    var followingCount : Nat;
    createdAt : OldTimestamp;
  };

  type OldDrawingId = Nat;
  type OldDrawingInternal = {
    id : OldDrawingId;
    author : OldUserId;
    var title : Text;
    var description : Text;
    imageBlob : OldBlob;
    likedBy : Set.Set<OldUserId>;
    savedBy : Set.Set<OldUserId>;
    var tags : [Text];
    createdAt : OldTimestamp;
    var updatedAt : OldTimestamp;
  };

  type OldUserRole = { #admin; #guest; #user };

  type OldAccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, OldUserRole>;
  };

  type OldUserState = {
    profiles : Map.Map<OldUserId, OldUserProfileInternal>;
    following : Map.Map<OldUserId, Set.Set<OldUserId>>;
  };

  type OldDrawingState = {
    drawings : Map.Map<OldDrawingId, OldDrawingInternal>;
    var nextId : OldDrawingId;
  };

  // ── Old actor stable shape ──
  type OldActor = {
    accessControlState : OldAccessControlState;
    userState : OldUserState;
    drawingState : OldDrawingState;
  };

  // ── New types (matching current lib/users.mo State) ──
  type NewUserId = Principal;
  type NewTimestamp = Int;
  type NewBlob = Blob;

  type NewUserProfileInternal = {
    id : NewUserId;
    var displayName : Text;
    var bio : Text;
    var avatarBlob : ?NewBlob;
    var followerCount : Nat;
    var followingCount : Nat;
    var postCount : Nat;
    var isAnonymousByDefault : Bool;
    createdAt : NewTimestamp;
  };

  type NewUserState = {
    profiles : Map.Map<NewUserId, NewUserProfileInternal>;
    following : Map.Map<NewUserId, Set.Set<NewUserId>>;
    followers : Map.Map<NewUserId, Set.Set<NewUserId>>;
  };

  // ── New actor stable shape ──
  // Note: drawingState is dropped; postState is new (no migration needed, starts empty)
  type NewActor = {
    userState : NewUserState;
  };

  // ── Migration function ──
  public func run(old : OldActor) : NewActor {
    // Migrate each user profile: rename `username` → `displayName`, add `postCount` and `isAnonymousByDefault`
    let newProfiles = old.userState.profiles.map<OldUserId, OldUserProfileInternal, NewUserProfileInternal>(
      func(_id, p) {
        {
          id = p.id;
          var displayName = p.username;
          var bio = p.bio;
          var avatarBlob = p.avatarBlob;
          var followerCount = p.followerCount;
          var followingCount = p.followingCount;
          var postCount = 0;
          var isAnonymousByDefault = false;
          createdAt = p.createdAt;
        }
      }
    );

    let newUserState : NewUserState = {
      profiles = newProfiles;
      following = old.userState.following;
      followers = Map.empty<NewUserId, Set.Set<NewUserId>>();
    };

    { userState = newUserState };
  };
};
