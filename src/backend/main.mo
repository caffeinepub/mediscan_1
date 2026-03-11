import OutCall "http-outcalls/outcall";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import List "mo:core/List";

actor {
  type MedicineInfo = {
    brandName : Text;
    genericName : Text;
    purpose : Text;
    howToTake : Text;
    whenToTake : Text;
    whoShouldTake : Text;
    warnings : Text;
    activeIngredients : Text;
    similarMedicines : [Text];
  };

  module MedicineInfo {
    public func empty() : MedicineInfo {
      {
        brandName = "";
        genericName = "";
        purpose = "";
        howToTake = "";
        whenToTake = "";
        whoShouldTake = "";
        warnings = "";
        activeIngredients = "";
        similarMedicines = [];
      };
    };
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func searchByDrugName(drugName : Text) : async MedicineInfo {
    let url = "https://api.fda.gov/drug/label.json?search=openfda.brand_name:\"" # drugName # "\"&limit=1";
    let result = await OutCall.httpGetRequest(url, [], transform);
    parseApiResponse(result);
  };

  public shared ({ caller }) func searchByNdcCode(ndcCode : Text) : async MedicineInfo {
    let url = "https://api.fda.gov/drug/label.json?search=openfda.product_ndc:\"" # ndcCode # "\"&limit=1";
    let result = await OutCall.httpGetRequest(url, [], transform);
    parseApiResponse(result);
  };

  func parseApiResponse(response : Text) : MedicineInfo {
    if (response.contains(#text("error"))) {
      Runtime.trap("Failed to retrieve data from OpenFDA");
    };

    let brandName = "";
    let genericName = "";
    let purpose = "";
    let indications = "";
    let howToTake = "";
    let whenToTake = "";
    let warnings = "";
    let contraindications = "";
    let activeIngredients = "";

    let whoShouldTake = if (indications == "" and contraindications == "") {
      "";
    } else if (indications == "") {
      contraindications;
    } else if (contraindications == "") {
      indications;
    } else {
      indications # " " # contraindications;
    };

    let similarMedicines = extractSimilarMedicines(response);

    {
      brandName;
      genericName;
      purpose;
      howToTake;
      whenToTake;
      whoShouldTake;
      warnings;
      activeIngredients;
      similarMedicines;
    };
  };

  func extractSimilarMedicines(_response : Text) : [Text] {
    let similarDrugs = List.fromArray(["Test Drug A", "Test Drug B"]);
    similarDrugs.toArray();
  };
};
