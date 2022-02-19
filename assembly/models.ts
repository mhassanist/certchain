@nearBindgen
export class Organization {
  name: string;
  about: string;
  orgId: string;
  issuerId: string;
  certCount: u64;

  constructor(name: string, about: string, orgId: string, issuerId: string) {
    this.name = name;
    this.about = about;
    this.orgId = orgId;
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
  issueDate: u64;

  constructor(
    name: string,
    holderName: string,
    description: string,
    code: string,
    issueDate: u64
  ) {
    this.name = name;
    this.description = description;
    this.holderName = holderName;
    this.code = code;
    this.issueDate = issueDate;
  }
}
