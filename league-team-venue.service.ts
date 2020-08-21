import {Injectable} from '@angular/core';
import {LeagueDetails} from '../../pages/league/models/league-details.model';
import {collectionLookup} from '../constants/collection-name-lookup.const';
import {AngularFirestore} from '@angular/fire/firestore';
import {VenueDetailsModel} from '../../pages/venues/models/venue-details.model';
import {TeamDetails} from '../../pages/teams/models/team-details';

@Injectable({
  providedIn: 'root'
})
export class LeagueTeamVenueService {

  constructor(private  fireStore: AngularFirestore) {
  }

  // get all leagues
  async getAllLeagues(): Promise<LeagueDetails[]> {
    const leagueDetailsList: LeagueDetails[] = [];
    await this.fireStore.collection(collectionLookup.leagueDetails, ref =>
      ref.where('aboveLimit', '==', false)).get()
      .toPromise().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          leagueDetailsList.push(doc.data() as LeagueDetails);
        });
      });
    return leagueDetailsList;
  }

  // gets all leagues which do not have max teams
  async getAllLeaguesWithTeamShortage(): Promise<LeagueDetails[]> {
    const leagueDetailsList: LeagueDetails[] = [];
    await this.fireStore.collection(collectionLookup.leagueDetails).get()
      .toPromise().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          leagueDetailsList.push(doc.data() as LeagueDetails);
        });
      });
    return leagueDetailsList;
  }

  /// get all venues for a given league
  async getAllVenuesInALeague(leagueId: string): Promise<VenueDetailsModel[]> {
    const venueDetailsList: VenueDetailsModel[] = [];
    await this.fireStore.collection(collectionLookup.venueDetails, ref =>
      ref.where('leagueId', '==', leagueId)).get()
      .toPromise().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          venueDetailsList.push(doc.data() as VenueDetailsModel);
        });
      });
    return venueDetailsList;
  }

  // get all teams for given league
  async getAllTeamsInALeague(leagueId: string): Promise<TeamDetails[]> {
    const teamDetailsList: TeamDetails[] = [];
    await this.fireStore.collection(collectionLookup.teamDetails, ref =>
      ref.where('leagueId', '==', leagueId)).get()
      .toPromise().then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          teamDetailsList.push(doc.data() as TeamDetails);
        });
      });
    return teamDetailsList;
  }


  /* This is actually a set method, stands alone from methods above
    tryng to set number of current teams in a legue, like keep track of them
    so that we never put more teams than space. This functionality can be replaced
    if we have a constant number which can serve as a max number of teams across all
    legues.
  */

  async incrementTeamsInLegue(legueID: string) {
   await this.fireStore.collection(collectionLookup.teamDetails).doc(legueID).get().toPromise()
   .then(docSnap => {
      const league = docSnap.data() as LeagueDetails;
      league.currentNumberOfTeams = league.currentNumberOfTeams + 1;
      if (league.currentNumberOfTeams <= (league.numberOfTeams - 1)) {
        league.aboveLimit = league.currentNumberOfTeams === league.numberOfTeams ? true : false;
        this.fireStore.collection(collectionLookup.teamDetails).doc(legueID).update({
          league
        });
      }
   });
  }
}
