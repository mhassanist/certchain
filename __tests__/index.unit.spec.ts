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
    expect(
      contract.addOrganization(
        "ABCAcademy",
        "ABCAcademy",
        "From zero to hero training"
      )
    ).toBe(
      "Organization created with code= " +
        "ABCACADEMY" +
        " and name= " +
        "ABCAcademy"
    );
    expect(contract.addOrganization("Yahoo", "Yahoo", "Used to be")).toBe(
      "Organization created with code= " + "YAHOO" + " and name= " + "Yahoo"
    );
    expect(contract.addOrganization("Yahoo", "Yahoo", "Used to be")).toBe(
      "Organization with the same code already there"
    );

    expect(contract.orgCount).toBe(2);

    expect(contract.addOrganization("Yahoo2", "Yahoo2", "Used to be")).toBe(
      "Organization created with code= " + "YAHOO2" + " and name= " + "Yahoo2"
    );

    expect(contract.orgCount).toBe(3);
  });
});
