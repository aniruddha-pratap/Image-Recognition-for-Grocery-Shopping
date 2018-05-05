import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SignupPage } from '../../pages/signup/signup';
import { HomePage } from '../../pages/home/home';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {
  }

  login(){
this.navCtrl.setRoot(HomePage);
  }
  goToSignup(){
    this.navCtrl.push(SignupPage);
  }
  
}
