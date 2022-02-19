import { PersistentVector, PersistentMap, Context } from "near-sdk-core";
import { Organization, Certificate } from "./models";

@nearBindgen
export class Contract {
  public orgCount: u64 = 0;
  public certCount: u64 = 0;

  //PersistentVector required to keep track of the keys.
  keys: PersistentVector<string> = new PersistentVector<string>("keys");
  organizations: PersistentMap<string, Organization> = new PersistentMap<
    string,
    Organization
  >("orgs"); //key:orgCode, value: org object. Value could be of any type.

  certificates: PersistentMap<string, Certificate> = new PersistentMap<
    string,
    Certificate
  >("certs"); //orgCode, orgName

  @mutateState()
  addOrganization(orgId: string, orgName: string, orgAbout: string): string {
    orgId = orgId.toUpperCase(); //Uppercase organization IDs to ease comparisons.

    let o = new Organization(orgName, orgAbout, orgId, Context.sender);
    if (this.organizations.contains(orgId)) {
      return "Organization with the same code already there";
    }

    this.keys.push(orgId); //save the keys here while saving the value objects
    this.organizations.set(orgId, o);

    this.orgCount = this.orgCount + 1;

    return (
      "Organization created with code= " +
      orgId.toUpperCase() +
      " and name= " +
      orgName.toUpperCase()
    );
  }

  getOrganizations(): Map<string, Organization> {
    //maps can't be returned directly. You need to copy the values to a temp normal map and return it
    const res: Map<string, Organization> = new Map<string, Organization>();
    for (let i = 0; i < this.keys.length; i++) {
      res.set(this.keys[i], this.organizations.getSome(this.keys[i]));
    }
    return res;
  }

  ///issue certificate
  issueCertificate(
    orgId: string,
    certName: string,
    certDescription: string,
    holderName: string,
    holderInfo: string
  ): string {
    //find organizarion
    if (!this.organizations.contains(orgId)) {
      return "No organization with this id could be found.";
    }
    let org = this.organizations.getSome(orgId);
    if (org.issuerId != Context.sender) {
      return "Issuer id does not match.";
    }

    let certId = orgId + (1000 + org.certCount + 1).toString();
    const cert: Certificate = new Certificate(
      certName,
      certDescription,
      certId,
      holderName + " " + holderInfo,
      Context.blockTimestamp
    );

    org.certCount++;
    this.certCount++;

    return "Certificate created wit id: " + certId;
  }

  findCert(certId: string): string {
    if (this.certificates.contains(certId)) {
      return (
        "{" +
        this.certificates.getSome(certId).code +
        "," +
        this.certificates.getSome(certId).name +
        "," +
        this.certificates.getSome(certId).holderName +
        "," +
        this.certificates.getSome(certId).description +
        "," +
        this.certificates.getSome(certId).description +
        "," +
        "}"
      );
    } else {
      return "";
    }
  }
}
