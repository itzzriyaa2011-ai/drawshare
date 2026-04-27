module {
  public type UserId = Principal;
  public type PostId = Nat;
  // Legacy alias kept for backward compatibility
  public type DrawingId = Nat;
  public type Timestamp = Int;

  public type Page<T> = {
    items : [T];
    total : Nat;
    offset : Nat;
    limit : Nat;
  };
};
