//import your contract code
import { Contract } from "../assembly";

//take an instance of the contract
let contract: Contract;

//make sure the instance is properly created
beforeAll(() => {
  contract = new Contract();
});

//"describe" describes a test group that can have multiple tests inside
describe("Creating an organization", () => {
  // a sample test inside the test group.
  test("Creating an organization", () => {
    expect(contract.addOrganization("Yahoo", "Yahoo", "Used to be")).toBe(
      "Organization created with code= " + "YAHOO" + " and name= " + "YAHOO"
    );

    expect(contract.addOrganization("Yahoo", "Yahoo", "Used to be")).toBe(
      "Organization with the same code already there"
    );

    expect(contract.orgCount).toBe(1);
  });
});
