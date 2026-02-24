import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Review = {
    id : Nat;
    studentName : Text;
    course : Text;
    rating : Nat;
    reviewText : Text;
  };

  type FreeNote = {
    id : Nat;
    title : Text;
    description : Text;
    fileUrl : Text;
    category : Text;
    uploadTimestamp : Int;
  };

  type YouTubeLecture = {
    id : Nat;
    title : Text;
    description : Text;
    videoUrl : Text;
    category : Text;
    uploadTimestamp : Int;
  };

  var nextId = 0;
  let reviews = Map.empty<Nat, Review>();
  let freeNotes = Map.empty<Nat, FreeNote>();
  let youTubeLectures = Map.empty<Nat, YouTubeLecture>();

  // Review System
  public shared ({ caller }) func submitReview(studentName : Text, course : Text, rating : Nat, reviewText : Text) : async () {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let review : Review = {
      id = nextId;
      studentName;
      course;
      rating;
      reviewText;
    };

    reviews.add(nextId, review);
    nextId += 1;
  };

  public query ({ caller }) func getReviews() : async [Review] {
    reviews.values().toArray();
  };

  // Free Resources System
  public shared ({ caller }) func addFreeNote(title : Text, description : Text, fileUrl : Text, category : Text) : async () {
    let freeNote : FreeNote = {
      id = nextId;
      title;
      description;
      fileUrl;
      category;
      uploadTimestamp = Time.now();
    };

    freeNotes.add(nextId, freeNote);
    nextId += 1;
  };

  public shared ({ caller }) func addYouTubeLecture(title : Text, description : Text, videoUrl : Text, category : Text) : async () {
    let lecture : YouTubeLecture = {
      id = nextId;
      title;
      description;
      videoUrl;
      category;
      uploadTimestamp = Time.now();
    };

    youTubeLectures.add(nextId, lecture);
    nextId += 1;
  };

  public query ({ caller }) func getFreeNotes() : async [FreeNote] {
    let notes = freeNotes.values().toArray();
    notes.sort(
      func(a, b) {
        if (a.uploadTimestamp > b.uploadTimestamp) { #less } else if (a.uploadTimestamp < b.uploadTimestamp) { #greater } else { #equal };
      }
    );
  };

  public query ({ caller }) func getYouTubeLectures() : async [YouTubeLecture] {
    let lectures = youTubeLectures.values().toArray();
    lectures.sort(
      func(a, b) {
        if (a.uploadTimestamp > b.uploadTimestamp) { #less } else if (a.uploadTimestamp < b.uploadTimestamp) { #greater } else { #equal };
      }
    );
  };

  public shared ({ caller }) func deleteFreeNote(id : Nat) : async Bool {
    if (freeNotes.containsKey(id)) {
      freeNotes.remove(id);
      true;
    } else {
      Runtime.trap("FreeNote not found");
    };
  };

  public shared ({ caller }) func deleteYouTubeLecture(id : Nat) : async Bool {
    if (youTubeLectures.containsKey(id)) {
      youTubeLectures.remove(id);
      true;
    } else {
      Runtime.trap("YouTubeLecture not found");
    };
  };
};
