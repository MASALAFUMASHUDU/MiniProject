import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {LeagueOwnerDetails, LeagueOwnerRegistrationDetails} from "../models/league-owner-details.model";
import {AngularFirestore} from "@angular/fire/firestore";
import {collectionLookup} from "../constants/collection-name-lookup.const";

@Injectable()
export class RegisterService {

  constructor(private fireAuth: AngularFireAuth,
              private fireStore: AngularFirestore) {
  }

  registerPerson(leagueOwnerRegistrationDetails: LeagueOwnerRegistrationDetails) {
    return new Promise((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(leagueOwnerRegistrationDetails.emailAddress, leagueOwnerRegistrationDetails.password)
        .then(res => {
          this.sendVerificationMailOnRegistration();
          this.addPersonFileToFirestore(leagueOwnerRegistrationDetails, res.user.uid).then(result => {
            resolve(result);
          }).catch(err => {
            reject(err);
          });
        }).catch(err => {
        reject(err);
      });
    });
  }

  // Send email verification when new user sign up
  sendVerificationMailOnRegistration() {
    this.fireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        //just let user know that they need to verify this email
      });
  }

  addPersonFileToFirestore(leagueOwnerRegistrationDetails: LeagueOwnerRegistrationDetails, uid: string) {
    const leagueOwnerDetails: LeagueOwnerDetails = {...leagueOwnerRegistrationDetails} as LeagueOwnerDetails;
    this.removePassword(leagueOwnerDetails);
    return new Promise((resolve, reject) => {
      leagueOwnerDetails.entityId = uid;
      leagueOwnerDetails.registeredDate = new Date().toLocaleDateString();
      this.fireAuth.auth.signInWithEmailAndPassword(leagueOwnerRegistrationDetails.emailAddress, leagueOwnerRegistrationDetails.password)
        .then(signInRes => {
          this.fireStore.collection(collectionLookup.leagueOwnerDetails).doc(uid).set(leagueOwnerDetails)
            .then(res => {
              resolve('Successfully registered!');
            }).catch(err => {
            reject('There was an error trying to register');
          });
        }).catch(signInErr => {
        reject('There was an error trying to register');
      });
    });
  }

  removePassword(userDetail) {
    delete userDetail.password;
    delete userDetail.repassword;
  }
}
