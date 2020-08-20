import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {LeagueOwnerRegistrationDetails} from "../../shared/models/league-owner-details.model";
import {RegisterService} from "../../shared/services/register.service";
import {Router} from "@angular/router";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isButtonLoading = false;

  constructor(private route: Router,
              private registerService: RegisterService,
              private userService: UserService) {
  }

  ngOnInit() {
  }

  onRegister(form: NgForm) {
    this.isButtonLoading = true;
    const registrationUserDetails = Object.assign({}, form.value) as LeagueOwnerRegistrationDetails;
    if (form.valid) {
      registrationUserDetails.searchIndex = [
        registrationUserDetails.firstName,
        registrationUserDetails.surname,
        registrationUserDetails.mobileNumber,
        registrationUserDetails.emailAddress
      ];
      this.handleRegisterResponse(registrationUserDetails, form);
    } else {
      // Do nothing
      this.isButtonLoading = false;
    }
  }

  handleRegisterResponse(registrationUserDetails: LeagueOwnerRegistrationDetails, registerForm: NgForm) {
    this.registerService.registerPerson(registrationUserDetails).then(res => {
      this.userService.signOutUser().then(r => {
        registerForm.resetForm();  // reset to not have errors
        this.isButtonLoading = false;
      });
    }).catch(err => {
      this.userService.signOutUser().then(r => {
        this.isButtonLoading = false;
      });
    });
  }
}
