import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/users";
import Common "../types/common";

module {
  public type State = {
    profiles : Map.Map<Common.UserId, Types.UserProfileInternal>;
    // followerId -> Set of followeeIds
    following : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
  };

  public func initState() : State {
    {
      profiles = Map.empty<Common.UserId, Types.UserProfileInternal>();
      following = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
    };
  };

  public func getProfile(state : State, userId : Common.UserId) : ?Types.UserProfile {
    switch (state.profiles.get(userId)) {
      case (?internal) ?toPublic(internal);
      case null null;
    };
  };

  public func saveProfile(state : State, caller : Common.UserId, input : Types.UpdateProfileInput) : () {
    switch (state.profiles.get(caller)) {
      case (?existing) {
        existing.username := input.username;
        existing.bio := input.bio;
        existing.avatarBlob := input.avatarBlob;
      };
      case null {
        let newProfile : Types.UserProfileInternal = {
          id = caller;
          var username = input.username;
          var bio = input.bio;
          var avatarBlob = input.avatarBlob;
          var followerCount = 0;
          var followingCount = 0;
          createdAt = Time.now();
        };
        state.profiles.add(caller, newProfile);
      };
    };
  };

  public func follow(state : State, caller : Common.UserId, target : Common.UserId) : () {
    if (Principal.equal(caller, target)) return;

    // Get or create the caller's following set
    let callerFollowing = switch (state.following.get(caller)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        state.following.add(caller, s);
        s;
      };
    };

    // Only update counts if not already following
    if (not callerFollowing.contains(target)) {
      callerFollowing.add(target);

      // Update caller's followingCount
      switch (state.profiles.get(caller)) {
        case (?p) p.followingCount += 1;
        case null {};
      };

      // Update target's followerCount
      switch (state.profiles.get(target)) {
        case (?p) p.followerCount += 1;
        case null {};
      };
    };
  };

  public func unfollow(state : State, caller : Common.UserId, target : Common.UserId) : () {
    switch (state.following.get(caller)) {
      case (?callerFollowing) {
        if (callerFollowing.contains(target)) {
          callerFollowing.remove(target);

          // Update caller's followingCount
          switch (state.profiles.get(caller)) {
            case (?p) {
              if (p.followingCount > 0) p.followingCount -= 1;
            };
            case null {};
          };

          // Update target's followerCount
          switch (state.profiles.get(target)) {
            case (?p) {
              if (p.followerCount > 0) p.followerCount -= 1;
            };
            case null {};
          };
        };
      };
      case null {};
    };
  };

  public func isFollowing(state : State, follower : Common.UserId, followee : Common.UserId) : Bool {
    switch (state.following.get(follower)) {
      case (?s) s.contains(followee);
      case null false;
    };
  };

  public func toPublic(internal : Types.UserProfileInternal) : Types.UserProfile {
    {
      id = internal.id;
      username = internal.username;
      bio = internal.bio;
      avatarBlob = internal.avatarBlob;
      followerCount = internal.followerCount;
      followingCount = internal.followingCount;
      createdAt = internal.createdAt;
    };
  };
};
