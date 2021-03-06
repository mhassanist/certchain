export type Nullable<T> = T | null;

@nearBindgen
export class Organization {
  name: string;
  about: string;
  orgId: string;
  issuerId: string;
  certCount: u64;

  constructor(id: string, name: string, about: string, issuerId: string) {
    this.name = name;
    this.about = about;
    this.orgId = id;
    this.issuerId = issuerId;
    this.certCount = 0;
  }
}

@nearBindgen
export class Certificate {
  name: string;
  description: string;
  code: string;
  holderName: string;
  issuingOrgId: string;
  issueDate: u64;

  constructor(
    name: string,
    holderName: string,
    description: string,
    code: string,
    issuingOrgId: string,
    issueDate: u64
  ) {
    this.name = name;
    this.description = description;
    this.holderName = holderName;
    this.code = code;
    this.issueDate = issueDate;
    this.issuingOrgId = issuingOrgId;
  }
}
