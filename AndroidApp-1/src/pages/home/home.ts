import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AddCardPage } from '../../pages/addcard/addcard';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http,Headers ,RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise'; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  films: Observable<any>;
  nutrients;
  addCardArray = [];
  name:any;
  weight:any;
  measure:any;
  count = 0;
  nutrientsInfo: Observable<any>;
  nutrientsIds: Observable<any>;
  CheckIngValueFlag:boolean = false;
  sendingValue:any;
  showAfterDataonly:boolean = false;
  loader:any;
  
  require: any  
  imageURI:any;
  imageFileName:any;

  constructor(public http: Http,private transfer: FileTransfer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,public navCtrl: NavController,private camera: Camera,public httpClient: HttpClient) {
            
    }

  

  public base64Image: string;
  Camera(){
    const options: CameraOptions = {
          quality: 100,
          //destinationType: this.camera.DestinationType.FILE_URI,
          destinationType: this.camera.DestinationType.DATA_URL,
          //sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE
        }
        this.camera.getPicture(options).then((imageData) => {
          console.log('Tejaram imageURI '+ imageData);
          this.imageURI = imageData;
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
        // Handle error
        });
  }

  ngOnInit() 
  {
    console.log("ngOnIt");
    //https://api.nal.usda.gov/ndb/search/?ds=Standard%20Reference&format=json&q=banana+raw&sort=n&max=2&offset=0&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&fg=0900
    //https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno=01009
  }
  nutrientsData(ndbno)
  {
    this.nutrients = "";    
    this.nutrientsInfo = this.httpClient.get('https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno='+ndbno+'');
    this.nutrientsInfo
    .subscribe(data => {
      this.loader.dismiss();
      //debugger;//merging
      console.log('ndbno: ', data);
      this.nutrients = data["report"].foods[0].nutrients;
      if(this.nutrients)
        this.showAfterDataonly = true;
      this.addCardArray =  this.addCardArray.concat(data["report"].foods);
      this.name = data["report"].foods[0].name;
      this.weight = data["report"].foods[0].weight;
      this.measure = data["report"].foods[0].measure;
      console.log("download Image" +this.nutrients);
    })  
  }
  loadingLoada(name)
  {
    this.films = this.httpClient.get('https://api.nal.usda.gov/ndb/search/?ds=Standard%20Reference&format=json&q='+name+'+raw&sort=n&max=2&offset=0&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&fg=0900');
    this.films
    .subscribe(data => 
      {
        console.log('my data: ', data);
        if(data["errors"]){
          this.nutrientsID(name);
        }else{
        if(data["list"].item[0].ndbno){   
          var ndbno = data["list"].item[0].ndbno;
          this.nutrientsData(ndbno);
        }else{
            this.nutrientsID(name);
        }
      }      
    })
  }
  nutrientsID(name){
    this.nutrientsIds = this.httpClient.get('https://api.nal.usda.gov/ndb/search/?ds=Standard%20Reference&format=json&q='+name+'+raw&sort=n&max=2&offset=0&api_key=vOcJ8s9IouIwURA4ldBwnF6C66gGxkETIWMq1LvY&fg=1100');
    this.nutrientsIds
    .subscribe(data => 
    {
        this.loader.dismiss();
        console.log('my data: ', data);
        if(data["errors"])
        {
          this.CheckIngValueFlag = true;
        }
        else
        {
          if(data["list"].item[0].ndbno)
          {
            var ndbno = data["list"].item[0].ndbno;
            this.nutrientsData(ndbno);
            this.CheckIngValueFlag = false;
          }
          else
          {
            this.CheckIngValueFlag = true;
          }
        }      
    })
  }
  AddCard(){
      //this.navCtrl.push(AddCardPage, { "details": this.nutrients });
          // if(this.addCardArray.length > 0){
             
          //     this.count ++;
          // }
          this.count = this.addCardArray.length;
          this.sendingValue = this.addCardArray;
  }
  OpenAddCard(){

    this.navCtrl.push(AddCardPage, { "details": this.sendingValue });
  }
  upload()
  {
    // this.addCardArray = [];
    this.loader = this.loadingCtrl.create
    ({
      content: "Uploading..."
    });
    //this.loader.present();

    
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("loadend", function(evt)
    {
      var product = this.response;
      console.log('tejaram response '+JSON.stringify(product));
      
    });
    xhr.open("POST", "http://18.236.87.78:5000/");
    // xhr.responseType = "json";
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Accept", "application/json");
    //xhr.setRequestHeader(Access-Control-Allow-Origin
    const data = new FormData();
    data.append('image', this.imageURI);
    xhr.send(data); 
    //this.loader.dismiss();
    this.loadingLoada("banana");   
    /* The FileTransfer Code 
    const fileTransfer: FileTransferObject = this.transfer.create();    
    let options: FileUploadOptions = 
    {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      headers: {"Accept": "text/html"}
    }

    fileTransfer.upload(this.imageURI, 'http://18.236.87.78:5000/', options)
      .then((data) => 
      {
        console.log(data+" Uploaded Successfully");
        //this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
        this.loader.dismiss();
        // this.presentToast("Image uploaded successfully");
        this.loadingLoada("beans");
      }, (err) => {
        console.log(err);
    
        //  this.presentToast(err);
        this.loadingLoada("banana");
    });*/
  }
  
  presentToast(msg) 
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}



// const data = new FormData();
// // data.append('image', 'testName');
//   data.append('image', {
//       uri: this.state.controls.image.value.uri,
//       type: this.state.controls.image.value.type,
//       name: this.state.controls.image.value.fileName
//   });

//   //console.log("FD "+data.image);
//   fetch("http://18.236.87.78:5000/", {
//       method: "POST",
//       headers: {
//           "Accept": "text/html"
//       },
//       body: data
//   }).then((response) => response.text())
//       .then((responseJson) => {
//           console.log("Response is: "+ responseJson);
//       }).catch((error) => {
//       console.error(error);
//   });