import { Constants } from "../assembly/strings";
import { Contract } from "../assembly";
import { Nullable } from "../assembly/models";
import { VMContext } from "near-mock-vm";

let contract: Contract;
const CREATOR_ACCOUNT_ID = "bob";

beforeAll(() => {
  contract = new Contract();
  VMContext.setSigner_account_id(CREATOR_ACCOUNT_ID);
});

describe("Creating an organization", () => {
  test("Add organization", () => {
    expect(
      contract.createOrganizationAccount(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(
      Constants.ORG_WITH_CODE + "ABCACADEMY" + Constants.AND_NAME + "ABCAcademy"
    );

    expect(
      contract.createOrganizationAccount("TK", "DOESNT MATTER", "DOESNT MATTER")
    ).toBe(Constants.ORG_CODE_CANT_BE_LESS_THAN_THREE_CHAR);

    expect(contract.orgCount).toBe(1);
    expect(contract.organizations.contains("ABCACADEMY")).toBe(true);
    let org = contract.organizations.get("ABCACADEMY");
    expect(org).not.toBe(null);
    if (org != null) expect(org.name).toBe("ABCAcademy");
    if (org != null) expect(org.orgId).toBe("ABCACADEMY");
    if (org != null) expect(org.issuerId).toBe(CREATOR_ACCOUNT_ID);
    if (org != null) expect(org.certCount).toBe(0);
  });

  it("should not allow adding another org with the same id", () => {
    expect(
      contract.createOrganizationAccount(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(
      Constants.ORG_WITH_CODE + "ABCACADEMY" + Constants.AND_NAME + "ABCAcademy"
    );
    expect(contract.orgCount).toBe(1);
    expect(
      contract.createOrganizationAccount(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(Constants.ORG_ALREADY_THERE);
    expect(contract.orgCount).toBe(1);
  });
});

describe("Issue Certificate", () => {
  test("Issuing a new certificate", () => {
    expect(
      contract.createOrganizationAccount(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(
      Constants.ORG_WITH_CODE + "ABCACADEMY" + Constants.AND_NAME + "ABCAcademy"
    );
    expect(
      contract.issueCertificate(
        "ABCACADEMY", //orgid
        "NCD | NEAR Certified Developer", //cert name
        "NEAR Certified Developer", //cert description
        "MOHAMMED HASSAN", //holder
        "msaudi.cse@gmail.com"
      )
    ).toBe(
      Constants.CERT_WITH_CODE +
        "ABCACADEMY1001" +
        Constants.GENERATED_SUCCESSFULLY
    );

    expect(contract.getOrgInfo("ABCACADEMY").certCount).toBe(1);

    expect(
      contract.issueCertificate(
        "ABCACADEMY", //orgid
        "NCD | NEAR Certified Developer", //cert name
        "NEAR Certified Developer", //cert description
        "MOHAMMED HASSAN", //holder
        "msaudi.cse@gmail.com" //holder info
      )
    ).toBe(
      Constants.CERT_WITH_CODE +
        "ABCACADEMY1002" +
        Constants.GENERATED_SUCCESSFULLY
    );

    expect(contract.getOrgInfo("ABCACADEMY").certCount).toBe(2);
    expect(contract.findCert("ABCACADEMY1003")).toBeNull(); //cert not found
  });
});
