import { Component,  ViewChild, ElementRef, Input, HostListener, ViewChildren, QueryList,} from '@angular/core';
import { ChatService } from './chat.service';
import {Content} from 'ionic-angular';
import {NgxAutoScroll} from 'ngx-auto-scroll';
import { NotifierService } from 'angular-notifier'; 
 
import { container } from '@angular/core/src/render3/instructions';
function Console(message) {
  // access the "metadata" message
  console.log(message);
  // return a function closure, which
  // is passed the class as `target`
  return function(target) {
    console.log('Our decorated class', target);
  }; 
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 @ViewChild('NgScrollbar') NgScrollbar: ElementRef ;
 //@ViewChild(NgxAutoScroll) ngxAutoScroll :NgxAutoScroll;
 @ViewChildren('messageslist') msgList :QueryList<ElementRef>;
 @ViewChild('customNotification') customNotificationTmpl;
 //@Console('Hey!');
 
  title = 'my-app';
  sendBy :string = 'bot';
  trigger:string='0';
  triggerArray:string[]=[];
  messages: Array[]=[];
  row:string[]= [];
  count:number=0;
  city:string[] = [];
  data : {message: string, trigger:string};
  message: string;
  input :string = "";
  weather:object;
  isDesabled:boolean;
  input_messages:string[]= [];
  weather_city:string='';
  local_variable:{content:string, sendBy:string};
  private readonly notifier: NotifierService;
  dismissable:boolean;

  constructor(private chatService:ChatService, private notifierService:NotifierService){
    this.notifier = notifierService;
  };
  options:{x:number, y:number};
  ngAfterViewInit() {
    this.NgScrollbar.scrollToBottom(100);
    this.msgList.changes.subscribe((list:QueryList<ElementRef>)=>{
       this.NgScrollbar.scrollToBottom(100);
    });
  }
//   showNotification() {
//     const msg = {
//         message: 'Hi there!',
//         type: 'info'
//     };

//     this.notifier.show({
//         message: msg.message,
//         type: msg.type,
//         template: this.customNotificationTmpl
//      });
// }

  ngOnInit(){
    this.notifier.notify( 'success', 'You are awesome! I mean it!' );
    
    this.data = {message:"", trigger: this.trigger};
    this.chatService.sendMessage(this.data);
    this.chatService.getMessages().subscribe((row)=>{
      //this.ngxAutoScroll.forceScrollDown();
     // this.NgScrollbar.scrollToBottom().subscribe(console.log("new message recieved..."));
      if(row.id == null){
         this.trigger = this.triggerArray[this.count-1];
      }else{
        this.trigger = "id-"+row.id;
        this.triggerArray.push(this.trigger)
        this.count++;
      }
      if(row.msg_type == 'text'){
        this.isDesabled = false;
        var msg :string  = row.msg;
        this.local_variable = {content: msg, sendBy:'bot'};
      
        this.messages.push(this.local_variable);
        //this.ngxAutoScroll.forceScrollDown();
        //this.NgScrollbar.scrollToBottom().subscribe();
      }else if(row.msg_type == "radio"){
        this.isDesabled = true;
        this.local_variable = {content:row.msg, sendBy:'bot'};
        this.messages.push(this.local_variable)
       
        this.row = (row.options).split(',');
        //this.ngxAutoScroll.forceScrollDown();
        //this.NgScrollbar.scrollToBottom().subscribe(console.log("radio Input"));
        
      }else{
          console.log(row)
          if(row.status == 'single'){
           this.weather = (row[0]);
           this.weather_city = row.result.title;
           var weather = "Weather in "+this.weather_city+" => Weather state: "+row.result.weather_state_name+". min Temperature: "+row.result.min_temp+". max Temperature: "+row.result.max_temp;
           weather += ". Predictability: "+row.result.predictability+". Humidity: "+ row.result.humidity+". Air Pressure: "+row.result.air_pressure+". Visibility: "+row.result.visibility;
           this.local_variable = {content:weather, sendBy:'bot'};
           this.messages.push(this.local_variable);
           //this.ngxAutoScroll.forceScrollDown();
           //this.NgScrollbar.scrollToBottom().subscribe(console.log("ok =="));
          
          }else if(row.status == 'multiple'){
            for(var i =0; i< row.result.length; i++){
              this.city.push(row.result[i].title)
              //this.ngxAutoScroll.forceScrollDown();
              //this.NgScrollbar.scrollToBottom().subscribe(console.log("ok =="));
            }
          }else{
            this.local_variable = {content:row.result, sendBy:'bot'}
            this.messages.push(this.local_variable)
            //this.ngxAutoScroll.forceScrollDown();
            //this.NgScrollbar.scrollToBottom().subscribe(console.log("ok =="));
          }
      } 
  
     })
  }
  selectInput(e){
    this.data.message = e;
    this.message = e;
    this.data.trigger = e;
    this.row= [];
    this.local_variable = {content:this.message, sendBy:'user'};
    
    this.messages.push(this.local_variable);
    //this.ngxAutoScroll.forceScrollDown();
    //this.NgScrollbar.scrollToBottom().subscribe(console.log("new message recieved..."));  
    this.sendMessage();
    
  }
  selectCity(city){
    this.data.message = city;
    this.weather_city = city;
    this.data.trigger = "";
 
    this.city= [];
   // this.ngxAutoScroll.forceScrollDown();
    //this.NgScrollbar.scrollToBottom().subscribe(console.log("new message recieved..."));
    this.sendMessage();
    
  }
  sendInput(){
    console.log("clicked!")
    this.data = {message:this.message, trigger: this.trigger};
    
    if(this.message == ""){
      console.log("message blank")
      //alert("message can't be blank.");
      this.dismissable = true;
    }else{
      console.log("message not blank")
      this.dismissable = false;
      this.local_variable = {content:this.message, sendBy:'user'};
      this.messages.push(this.local_variable);
      this.sendMessage();
    }
   
    //this.ngxAutoScroll.forceScrollDown();
    //this.NgScrollbar.scrollToBottom(100).subscribe(console.log("ok =="));
   
   
  }
  sendMessage(){
    //this.data = {message:this.message, trigger: this.trigger};
    this.chatService.sendMessage(this.data);
    //this.ngxAutoScroll.forceScrollDown();
    //this.NgScrollbar.scrollToBottom().subscribe(console.log("ok =="));
    this.message = "";

  } 
}
