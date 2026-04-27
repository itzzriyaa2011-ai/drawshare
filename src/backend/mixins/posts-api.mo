import AccessControl "mo:caffeineai-authorization/access-control";
import UserLib "../lib/users";
import PostLib "../lib/posts";
import Types "../types/posts";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userState : UserLib.State,
  postState : PostLib.State,
) {
  // Create a photo post
  public shared ({ caller }) func createPost(input : Types.CreatePostInput) : async Types.Post {
    let post = PostLib.createPost(postState, caller, input);
    UserLib.incrementPostCount(userState, caller);
    post;
  };

  // Get a single post by ID
  public query func getPost(id : Common.PostId) : async ?Types.Post {
    PostLib.getPost(postState, id);
  };

  // Delete own post
  public shared ({ caller }) func deletePost(id : Common.PostId) : async () {
    PostLib.deletePost(postState, caller, id);
    UserLib.decrementPostCount(userState, caller);
  };

  // Explore feed — all public posts, reverse-chronological, paginated
  public query func explorePosts(offset : Nat, limit : Nat) : async Common.Page<Types.Post> {
    PostLib.listPosts(postState, offset, limit);
  };

  // Home feed — posts from followed users, reverse-chronological, paginated
  public query ({ caller }) func homeFeed(offset : Nat, limit : Nat) : async Common.Page<Types.Post> {
    let followingIds = UserLib.getFollowingIds(userState, caller);
    PostLib.listPostsByAuthors(postState, followingIds, offset, limit);
  };

  // Search posts by keyword in title or caption
  public query func searchPosts(keyword : Text, offset : Nat, limit : Nat) : async Common.Page<Types.Post> {
    PostLib.searchPosts(postState, keyword, offset, limit);
  };

  // Like / unlike
  public shared ({ caller }) func likePost(id : Common.PostId) : async () {
    PostLib.likePost(postState, caller, id);
  };

  public shared ({ caller }) func unlikePost(id : Common.PostId) : async () {
    PostLib.unlikePost(postState, caller, id);
  };

  public query func getPostLikeCount(id : Common.PostId) : async Nat {
    PostLib.getLikeCount(postState, id);
  };

  // Save / unsave
  public shared ({ caller }) func savePost(id : Common.PostId) : async () {
    PostLib.savePost(postState, caller, id);
  };

  public shared ({ caller }) func unsavePost(id : Common.PostId) : async () {
    PostLib.unsavePost(postState, caller, id);
  };

  public query ({ caller }) func getSavedPosts(offset : Nat, limit : Nat) : async Common.Page<Types.Post> {
    PostLib.getSavedPosts(postState, caller, offset, limit);
  };
};
