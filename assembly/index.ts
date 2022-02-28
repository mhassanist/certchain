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

  /** creating a new organziation
   * @param id an ID chosen by the organization when creating an account.
   * @param name the name of the organization to be created
   * @param about some info about the organization, typically includes their website
   */
  @mutateState()
  createOrganizationAccount(id: string, name: string, about: string): string {
    //Uppercase organization IDs to ease comparisons.
    id = id.toUpperCase();
    if (id.length < 3) {
      return Constants.ORG_CODE_CANT_BE_LESS_THAN_THREE_CHAR;
    }
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
  /**
   * @returns a serialized list of the organizations in the system
   * */
  getOrganizations(): Map<string, Organization> {
    //maps can't be returned directly. You need to copy the values to a temp normal map and return it
    const res: Map<string, Organization> = new Map<string, Organization>();
    for (let i = 0; i < this.keys.length; i++) {
      res.set(this.keys[i], this.organizations.getSome(this.keys[i]));
    }
    return res;
  }

  getOrgInfo(orgId: string): Organization {
    return this.organizations.getSome(orgId);
  }

  /**
   *
   * @param orgId the organization issuing the certificate
   * @param certName the name of the issued certificate (i.e. AWS Associate)
   * @param certDescription more details about the cert (i.e. number of hours)
   * @param holderName the person to issue the certificate for
   * @param holderInfo some more info about the person (i.e. email, id, something like that)
   * @returns success message (include cerficiate ID) or an error message
   */
  @mutateState()
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
      return Constants.NOT_AUTHORIZED_YOU_ARE_NOT_THE_OWNER;
    }

    let certId = orgId + (1000 + org.certCount + 1).toString();
    const cert: Certificate = new Certificate(
      certName,
      holderName + " " + holderInfo,
      certDescription,
      certId,
      orgId,
      Context.blockTimestamp
    );

    org.certCount++;
    this.organizations.set(org.orgId, org);
    this.certCount++;
    this.certificates.set(certId, cert);
    //return cert;
    return Constants.CERT_WITH_CODE + certId + Constants.GENERATED_SUCCESSFULLY;
  }
  /** find a certificate
   * @param certId the certificate id to look for
   * @returns the certifcate object or null
   */
  findCert(certId: string): Nullable<Certificate> {
    if (this.certificates.contains(certId)) {
      return this.certificates.getSome(certId);
    } else {
      return null;
    }
  }
}
