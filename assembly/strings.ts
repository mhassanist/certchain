export class Constants {
  public static ORG_ALREADY_THERE: string =
    "Organization with the same code already there";
  public static ORG_WITH_CODE: string = "Organization created with code= ";
  public static AND_NAME: string = " and name= ";
  public static NO_ORG_FOUND: string =
    "No organization with this id could be found.";
  public static ISSUER_NO_MATCH: string = "Issuer id does not match.";
  public static ORG_CODE_CANT_BE_LESS_THAN_THREE_CHAR: string =
    "Organization ID can't be less than 3 characters.";
  public static NOT_AUTHORIZED_YOU_ARE_NOT_THE_OWNER: string =
    "You can't issue certificates with an organization that you don't own";

  public static CERT_WITH_CODE: string = "Certification with code ";
  public static GENERATED_SUCCESSFULLY: string = " generated successfully";
}
