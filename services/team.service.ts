import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TeamDetails } from '../models/team-details';
import { collectionLookup } from 'src/app/shared/constants/collection-name-lookup.const';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  editTeam = {
    teamName: '',
    teamManagerName: '',
    numberOfPlayers: 0,
    teamId: ''
  };

  constructor(private fireStore: AngularFirestore) {
   }


  async createNewTeamInFirestore(teamDetails: TeamDetails) {
    if (!await this.checkIfTeamNameAlreadyTaken(teamDetails.teamNameSearchIndex)) {
      this.fireStore.collection(collectionLookup.teamDetails).add(teamDetails).then(doc => {
        // update with doc id
        this.fireStore.collection(collectionLookup.teamDetails).doc(doc.id)
          .update({teamId: doc.id}).then(x => null);
      });
    } else {
      console.log('team Name already taken');
    }
  }


  checkIfTeamNameAlreadyTaken(teamNameSearchIndex): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.fireStore.collection(collectionLookup.teamDetails, ref =>
        ref.where('teamNameSearchIndex', '==', teamNameSearchIndex)
          .limit(1)).get().toPromise().then(docsSnapshot => {
        const docs = docsSnapshot.docs;
        resolve(docs.length > 0);  // if there's any doc with such given name
      });
    });
  }


  updateTeamDetails(teamDetails: TeamDetails) {
    return new Promise((resolve, reject) => {
      this.fireStore.collection(collectionLookup.teamDetails).doc(teamDetails.teamId)
        .update({teamDetails}).then(res => {
          resolve(res);
      });
    });
  }
}
