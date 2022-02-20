//import your contract code
import { Constants } from "../assembly/strings";
import { Contract } from "../assembly";
import { VMContext } from "near-mock-vm";

//take an instance of the contract
let contract: Contract;
const CREATOR_ACCOUNT_ID = "bob";

beforeAll(() => {
  contract = new Contract();
  VMContext.setSigner_account_id(CREATOR_ACCOUNT_ID);
});

describe("Creating an organization", () => {
  test("Add organization", () => {
    expect(
      contract.addOrganization(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(
      Constants.ORG_WITH_CODE + "ABCACADEMY" + Constants.AND_NAME + "ABCAcademy"
    );

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
      contract.addOrganization(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(
      Constants.ORG_WITH_CODE + "ABCACADEMY" + Constants.AND_NAME + "ABCAcademy"
    );
    expect(contract.orgCount).toBe(1);
    expect(
      contract.addOrganization(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(Constants.ORG_ALREADY_THERE);
    expect(contract.orgCount).toBe(1);
  });
});
