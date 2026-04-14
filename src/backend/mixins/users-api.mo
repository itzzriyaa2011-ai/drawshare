import AccessControl "mo:caffeineai-authorization/access-control";
import UserLib "../lib/users";
import Types "../types/users";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userState : UserLib.State,
) {
  // Profile management — required by authorization extension
  public query ({ caller }) func getCallerUserProfile() : async ?Types.UserProfile {
    UserLib.getProfile(userState, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(input : Types.UpdateProfileInput) : async () {
    if (caller.isAnonymous()) {
      return;
    };
    UserLib.saveProfile(userState, caller, input);
  };

  public query func getUserProfile(userId : Common.UserId) : async ?Types.UserProfile {
    UserLib.getProfile(userState, userId);
  };

  // Social — follow/unfollow
  public shared ({ caller }) func followUser(target : Common.UserId) : async () {
    if (caller.isAnonymous()) {
      return;
    };
    UserLib.follow(userState, caller, target);
  };

  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async () {
    if (caller.isAnonymous()) {
      return;
    };
    UserLib.unfollow(userState, caller, target);
  };

  public query ({ caller }) func isFollowingUser(target : Common.UserId) : async Bool {
    UserLib.isFollowing(userState, caller, target);
  };
};
