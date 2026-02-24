import Map "mo:core/Map";

module {
  type Review = {
    id : Nat;
    studentName : Text;
    course : Text;
    rating : Nat;
    reviewText : Text;
  };
  type OldActor = {
    nextId : Nat;
    reviews : Map.Map<Nat, Review>;
  };

  // Empty migration - only new features
  type NewActor = {
    nextId : Nat;
    reviews : Map.Map<Nat, Review>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
