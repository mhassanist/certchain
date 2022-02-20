import { PersistentVector, PersistentMap, Context } from "near-sdk-core";
import { Organization, Certificate } from "./models";
import { Constants } from "./strings";

@nearBindgen
export class Contract {
  public orgCount: u64 = 0; //number of organizations in the system
  public certCount: u64 = 0; //number of certificates issued in the system

  //required to keep track of the keys.
  keys: PersistentVector<string> = new PersistentVector<string>("keys");
  //orgzniation data
  organizations: PersistentMap<string, Organization> = new PersistentMap<
    string,
    Organization
  >("orgs"); //key:orgCode, value: org object.

  certificates: PersistentMap<string, Certificate> = new PersistentMap<
    string,
    Certificate
  >("certs"); //orgCode, orgName

  @mutateState()
  addOrganization(id: string, name: string, about: string): string {
    //Uppercase organization IDs to ease comparisons.
    id = id.toUpperCase();

    let tempOrg = new Organization(id, name, about, Context.sender);
    if (this.organizations.contains(id)) {
      return Constants.ORG_ALREADY_THERE;
    }

    this.keys.push(id); //keys need to be maintained separately (PersistentMap limitation).
    this.organizations.set(id, tempOrg); //save new organization

    this.orgCount++;

    return (
      Constants.ORG_WITH_CODE + id.toUpperCase() + Constants.AND_NAME + name
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

  //TODO not completed yet
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
      return Constants.NO_ORG_FOUND;
    }
    let org = this.organizations.getSome(orgId);
    if (org.issuerId != Context.sender) {
      return Constants.ISSUER_NO_MATCH;
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
