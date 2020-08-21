import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from "./user.service";
import {collectionLookup} from "../constants/collection-name-lookup.const";

@Injectable()
export class LoginService {

  constructor(private fireAuth: AngularFireAuth,
              private fireStore: AngularFirestore,
              private userService: UserService) {
  }

  loginUser(email, password) {
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email, password).then(res => {
        if (res.user.emailVerified !== true) {
          this.sendVerificationMailOnLoginAttempt();
          reject('Please validate your email address. Kindly check your inbox.');
        } else {
          const userRes = this.fireAuth.auth.currentUser;
          this.fetchUserData(userRes.uid, collectionLookup.leagueOwnerDetails).then(leagueOwnerRes => { // check UID
            // it saves the person details, fireauth to user service
            this.setDataToUserService(leagueOwnerRes).then(dataSetRes => {
              resolve(dataSetRes);  // then resolves after setting data to service
            }).catch(dataSetErr => {
              reject('There was an error trying to Sign In');
            });
          });
        }
      }).catch(err => {
        reject('Email and Password combination not found.');
      });
    });
  }

  fetchUserData(uid, coll) {  // return Admin(PM or DA) or Patient
    return new Promise((resolve, reject) => {
      this.fireStore.collection(coll).doc(uid).get().toPromise().then(res => {
        const data = res.data();
        if (data === undefined) {
          console.log(data);
        } else {
          resolve(data);
        }
      }).catch(err => {
        console.log(err);
      });
    });
  }

  // Send email verification when new user sign up
  sendVerificationMailOnLoginAttempt() {
    this.fireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        // just let user know that they need to verify this emaik
      });
  }

  setDataToUserService(adminCustomerRes) {
    return new Promise((resolve, reject) => {
      this.userService.setPerson(adminCustomerRes);
      resolve('Done setting userService data');
    });
  }
}
