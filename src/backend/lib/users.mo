import Map "mo:core/Map";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Types "../types/users";
import Common "../types/common";

module {
  public type State = {
    profiles : Map.Map<Common.UserId, Types.UserProfileInternal>;
    // followerId -> Set of followeeIds
    following : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
    // followeeId -> Set of followerIds
    followers : Map.Map<Common.UserId, Set.Set<Common.UserId>>;
  };

  public func initState() : State {
    {
      profiles = Map.empty<Common.UserId, Types.UserProfileInternal>();
      following = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
      followers = Map.empty<Common.UserId, Set.Set<Common.UserId>>();
    };
  };

  public func getProfile(state : State, userId : Common.UserId) : ?Types.UserProfile {
    switch (state.profiles.get(userId)) {
      case (?internal) { ?toPublic(internal) };
      case null { null };
    };
  };

  public func saveProfile(state : State, caller : Common.UserId, input : Types.UpdateProfileInput) : () {
    switch (state.profiles.get(caller)) {
      case (?existing) {
        existing.displayName := input.displayName;
        existing.bio := input.bio;
        existing.avatarBlob := input.avatarBlob;
        existing.isAnonymousByDefault := input.isAnonymousByDefault;
      };
      case null {
        let newProfile : Types.UserProfileInternal = {
          id = caller;
          var displayName = input.displayName;
          var bio = input.bio;
          var avatarBlob = input.avatarBlob;
          var followerCount = 0;
          var followingCount = 0;
          var postCount = 0;
          var isAnonymousByDefault = input.isAnonymousByDefault;
          createdAt = Time.now();
        };
        state.profiles.add(caller, newProfile);
      };
    };
  };

  public func incrementPostCount(state : State, userId : Common.UserId) : () {
    switch (state.profiles.get(userId)) {
      case (?profile) { profile.postCount += 1 };
      case null {};
    };
  };

  public func decrementPostCount(state : State, userId : Common.UserId) : () {
    switch (state.profiles.get(userId)) {
      case (?profile) {
        if (profile.postCount > 0) { profile.postCount -= 1 };
      };
      case null {};
    };
  };

  public func follow(state : State, caller : Common.UserId, target : Common.UserId) : () {
    if (Principal.equal(caller, target)) {
      Runtime.trap("Cannot follow yourself");
    };
    switch (state.following.get(caller)) {
      case (?followingSet) {
        if (not followingSet.contains(target)) {
          followingSet.add(target);
          switch (state.profiles.get(caller)) {
            case (?p) { p.followingCount += 1 };
            case null {};
          };
          switch (state.followers.get(target)) {
            case (?followersSet) { followersSet.add(caller) };
            case null {
              let newSet = Set.empty<Common.UserId>();
              newSet.add(caller);
              state.followers.add(target, newSet);
            };
          };
          switch (state.profiles.get(target)) {
            case (?p) { p.followerCount += 1 };
            case null {};
          };
        };
      };
      case null {
        let newSet = Set.empty<Common.UserId>();
        newSet.add(target);
        state.following.add(caller, newSet);
        switch (state.profiles.get(caller)) {
          case (?p) { p.followingCount += 1 };
          case null {};
        };
        switch (state.followers.get(target)) {
          case (?followersSet) { followersSet.add(caller) };
          case null {
            let newFollowerSet = Set.empty<Common.UserId>();
            newFollowerSet.add(caller);
            state.followers.add(target, newFollowerSet);
          };
        };
        switch (state.profiles.get(target)) {
          case (?p) { p.followerCount += 1 };
          case null {};
        };
      };
    };
  };

  public func unfollow(state : State, caller : Common.UserId, target : Common.UserId) : () {
    switch (state.following.get(caller)) {
      case (?followingSet) {
        if (followingSet.contains(target)) {
          followingSet.remove(target);
          switch (state.profiles.get(caller)) {
            case (?p) { if (p.followingCount > 0) { p.followingCount -= 1 } };
            case null {};
          };
          switch (state.followers.get(target)) {
            case (?followersSet) { followersSet.remove(caller) };
            case null {};
          };
          switch (state.profiles.get(target)) {
            case (?p) { if (p.followerCount > 0) { p.followerCount -= 1 } };
            case null {};
          };
        };
      };
      case null {};
    };
  };

  public func isFollowing(state : State, follower : Common.UserId, followee : Common.UserId) : Bool {
    switch (state.following.get(follower)) {
      case (?followingSet) { followingSet.contains(followee) };
      case null { false };
    };
  };

  public func getFollowing(state : State, userId : Common.UserId) : [Types.UserProfile] {
    switch (state.following.get(userId)) {
      case (?followingSet) {
        followingSet.values().filterMap<Common.UserId, Types.UserProfile>(
          func(id) { getProfile(state, id) }
        ).toArray();
      };
      case null { [] };
    };
  };

  public func getFollowers(state : State, userId : Common.UserId) : [Types.UserProfile] {
    switch (state.followers.get(userId)) {
      case (?followersSet) {
        followersSet.values().filterMap<Common.UserId, Types.UserProfile>(
          func(id) { getProfile(state, id) }
        ).toArray();
      };
      case null { [] };
    };
  };

  public func getFollowingIds(state : State, userId : Common.UserId) : [Common.UserId] {
    switch (state.following.get(userId)) {
      case (?followingSet) { followingSet.toArray() };
      case null { [] };
    };
  };

  public func searchUsers(state : State, keyword : Text) : [Types.UserProfile] {
    let lower = keyword.toLower();
    state.profiles.values().filter<Types.UserProfileInternal>(
      func(p) { p.displayName.toLower().contains(#text lower) }
    ).map<Types.UserProfileInternal, Types.UserProfile>(
      func(p) { toPublic(p) }
    ).toArray();
  };

  public func toPublic(internal : Types.UserProfileInternal) : Types.UserProfile {
    {
      id = internal.id;
      displayName = internal.displayName;
      bio = internal.bio;
      avatarBlob = internal.avatarBlob;
      followerCount = internal.followerCount;
      followingCount = internal.followingCount;
      postCount = internal.postCount;
      isAnonymousByDefault = internal.isAnonymousByDefault;
      createdAt = internal.createdAt;
    };
  };
};
