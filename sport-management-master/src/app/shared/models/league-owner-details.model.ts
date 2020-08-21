export interface LeagueOwnerDetails {
  firstName: string;
  surname: string;
  emailAddress : string
  registeredDate : string  //auto-populated
  entityId: string; // entityId
  age: number;
  gender: string;
  searchIndex : string[];
  mobileNumber : string
}

export interface LeagueOwnerRegistrationDetails extends LeagueOwnerDetails{
  password: string;
  repassword: string;
}
