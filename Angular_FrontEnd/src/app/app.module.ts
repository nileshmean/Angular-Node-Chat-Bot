import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import {NgxAutoScrollModule} from 'ngx-auto-scroll';
//import {PopupModule} from 'ng2-opd-popup';
import { NotifierModule } from 'angular-notifier';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgScrollbarModule,
    NgxJsonViewerModule,
    NgxAutoScrollModule,
    NotifierModule.withConfig( {}),
    NgbModule.forRoot()
    ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
