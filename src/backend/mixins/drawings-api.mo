import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import DrawingLib "../lib/drawings";
import Types "../types/drawings";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  drawingState : DrawingLib.State,
) {
  // Drawing CRUD
  public shared ({ caller }) func postDrawing(input : Types.CreateDrawingInput) : async Types.Drawing {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to post a drawing");
    };
    DrawingLib.createDrawing(drawingState, caller, input);
  };

  public query func getDrawing(id : Common.DrawingId) : async ?Types.Drawing {
    DrawingLib.getDrawing(drawingState, id);
  };

  public shared ({ caller }) func updateDrawing(id : Common.DrawingId, input : Types.UpdateDrawingInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to update a drawing");
    };
    DrawingLib.updateDrawing(drawingState, caller, id, input);
  };

  public shared ({ caller }) func deleteDrawing(id : Common.DrawingId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to delete a drawing");
    };
    DrawingLib.deleteDrawing(drawingState, caller, id);
  };

  // Feed & Discovery
  public query func listDrawings(offset : Nat, limit : Nat) : async Common.Page<Types.Drawing> {
    DrawingLib.listDrawings(drawingState, offset, limit);
  };

  public query func listDrawingsByTag(tag : Text, offset : Nat, limit : Nat) : async Common.Page<Types.Drawing> {
    DrawingLib.listDrawingsByTag(drawingState, tag, offset, limit);
  };

  public query func searchDrawings(searchQuery : Text, offset : Nat, limit : Nat) : async Common.Page<Types.Drawing> {
    DrawingLib.searchDrawings(drawingState, searchQuery, offset, limit);
  };

  // Social interactions
  public shared ({ caller }) func likeDrawing(id : Common.DrawingId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to like a drawing");
    };
    DrawingLib.likeDrawing(drawingState, caller, id);
  };

  public shared ({ caller }) func unlikeDrawing(id : Common.DrawingId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to unlike a drawing");
    };
    DrawingLib.unlikeDrawing(drawingState, caller, id);
  };

  public query func getLikedBy(id : Common.DrawingId) : async [Common.UserId] {
    DrawingLib.getLikedBy(drawingState, id);
  };

  public shared ({ caller }) func saveDrawing(id : Common.DrawingId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to save a drawing");
    };
    DrawingLib.saveDrawing(drawingState, caller, id);
  };

  public shared ({ caller }) func unsaveDrawing(id : Common.DrawingId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to unsave a drawing");
    };
    DrawingLib.unsaveDrawing(drawingState, caller, id);
  };

  public query ({ caller }) func getSavedDrawings(offset : Nat, limit : Nat) : async Common.Page<Types.Drawing> {
    DrawingLib.getSavedDrawings(drawingState, caller, offset, limit);
  };

  // Recommendations
  public query ({ caller }) func getSuggestedDrawings(limit : Nat) : async [Types.Drawing] {
    DrawingLib.getSuggestedDrawings(drawingState, caller, limit);
  };

  public query func getTrendingDrawings(limit : Nat) : async [Types.Drawing] {
    DrawingLib.getTrendingDrawings(drawingState, limit);
  };
};
