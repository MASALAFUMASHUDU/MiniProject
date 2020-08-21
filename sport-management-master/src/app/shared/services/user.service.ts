import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {LeagueOwnerDetails} from "../models/league-owner-details.model";

enum enumKey {
  PERSON = 'person',
  ISSESSIONSTARTED = 'IsSessionStarted',
}

@Injectable({
  providedIn: 'root'
})

// holds the logged-in user data throughout the whole app lifetime
export class UserService {
  // makes the current logged in user data to be global
  // data is set from Person class , save to local storage
  private person: LeagueOwnerDetails;

  // specialistTypes = environment.specialistTypes; // move this to Firestore

  constructor(private fireAuth: AngularFireAuth,
              private router: Router) {
  }

  public getPerson(): LeagueOwnerDetails {
    if (this.person === undefined) {
      this.person = JSON.parse(localStorage.getItem(enumKey.PERSON));
    }
    return this.person;
  }

  public setPerson(value) {
    this.person = value;
    localStorage.setItem(enumKey.ISSESSIONSTARTED, JSON.stringify(true));
    localStorage.setItem(enumKey.PERSON, JSON.stringify(this.person));
    // this.setUserDetailsNavBar(value);
  }

  public updatePerson(value: LeagueOwnerDetails): void {
    this.person = value;
    localStorage.setItem(enumKey.PERSON, JSON.stringify(this.person));
    // this.setUserDetailsNavBar(value);
  }
  signOutUser() {
    return new Promise((resolve, reject) => {
      this.person = null;
      localStorage.clear();
      this.fireAuth.auth.signOut().then(r => {
        resolve(r);
      }).catch(err => {
        reject(err);
      });
    });
  }

  checkSessionStillExist(): boolean {
    // if perm , person and auth exits then we okay- if any of this is true return with negation
    // currently the Firebase Session takes forever, so below article
    // https://medium.com/@jwngr/implementing-firebase-auth-session-durations-82fa7b1fff08
    // Adds Security Rule and Client-side logic to set the session to your preferred time in two methods
    if ( // this.fireAuth.auth.currentUser === null ||
      this.getPerson() == null) {
      if (localStorage.getItem('IsSessionStarted')) { // if the session was started , show this error
        this.signOutUser().then(result => {
          this.redirectToLoginScreen('Session has expired', 'Error');
        });
      }
      return false;
    }
    return true;
  }

  redirectToLoginScreen(message: string, action: string) {
    // called by the checkSessionStillExist and takes you to login
    this.router.navigate(['/login']).then(r => {
      // this.snackBar.showSnackBar(message, action, 5, ['red-snackbar']);
    });
  }

  // public setUserDetailsNavBar(value: LeagueOwnerDetails): void {
  //   this.userDetailNavBarInfo = {
  //     hslColor: this.stringToHslColor(`${value?.surname} ${value?.firstName}`, 30, 80),
  //     userInitials: value?.firstName.substring(0, 1) + value?.surname.substring(0, 1),
  //     userNameAndSurname: value?.firstName + ' ' + value?.surname,
  //   } as IUserDetailNavBarInfo;
  //   localStorage.setItem(enumKey.PERSONNAVINFO, JSON.stringify(this.userDetailNavBarInfo ));
  // }
  //
  // public getUserDetailNavBarInfo(): IUserDetailNavBarInfo {
  //   if (this.userDetailNavBarInfo === undefined) {
  //     this.userDetailNavBarInfo = JSON.parse(localStorage.getItem(enumKey.PERSONNAVINFO));
  //   }
  //   return this.userDetailNavBarInfo;
  // }


  // stringToHslColor(str, s, l): string {
  //   let hash = 0;
  //   for (let i = 0; i < str.length; i++) {
  //     // tslint:disable-next-line:no-bitwise
  //     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  //   }
  //
  //   const h = hash % 360;
  //   return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  // }

}
