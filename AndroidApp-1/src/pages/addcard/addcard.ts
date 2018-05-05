import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'addcard-home',
  templateUrl: 'addcard.html'
})
export class AddCardPage {
  partOfTitle;
  itemCount:any;
  name:any;
  measure:any;
  weight:any;
  numberOfItem:any;
  constructor(public navCtrl: NavController,public navParams:NavParams) {
        this.partOfTitle = this.navParams.get('details');
        this.itemCount = this.partOfTitle.length;
        console.log("Details"+this.partOfTitle);
       // this.name = this.partOfTitle[0].name;
        //this.measure = this.partOfTitle[0].measure;
        //this.weight = this.partOfTitle[0].weight;
        this.numberOfItem =1;

  }    
  

   ngOnInit() {
    console.log(" Add Card ngOnIt");
   //https://api.nal.usda.gov/ndb/search/?ds=Standard%20Reference&format=json&q=banana+raw&sort=n&max=2&offset=0&api_key=DEMO_KEY&fg=0900
   //https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=DEMO_KEY&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno=01009
  }
  remove(){
if(this.numberOfItem >1){
this.numberOfItem--;
}
  }
  add(){
this.numberOfItem++;
  }
}
