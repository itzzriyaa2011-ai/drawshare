import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import UserLib "lib/users";
import DrawingLib "lib/drawings";
import UsersMixin "mixins/users-api";
import DrawingsMixin "mixins/drawings-api";

actor {
  // Authorization state (manages login/roles)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Domain state
  let userState = UserLib.initState();
  let drawingState = DrawingLib.initState();

  // Domain API mixins
  include UsersMixin(accessControlState, userState);
  include DrawingsMixin(accessControlState, drawingState);
};
