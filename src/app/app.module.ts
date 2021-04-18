import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgxQueryParamsModule } from '@rautils/ngx-query-params';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    NgxQueryParamsModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
