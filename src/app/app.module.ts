import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatMenuModule, MatPaginatorModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AboutUsComponent } from './about-us/about-us.component';
import { GraficosComponent } from './graficos/graficos.component';
import { AccessTokenComponent } from './integration/access-token/access-token.component'
import { DomseguroPipe } from './integration/pipes/domseguro.pipe'
import { NoimagePipe } from './integration/pipes/noimage.pipe';
import { ReceiptComponent } from './receipt/receipt.component';
import { MsToSecondsPipe } from './integration/pipes/ms-to-seconds.pipe'
import { CharacterSanitizerPipe } from './integration/pipes/character-sanitizer.pipe';
import { ComparationComponent } from './comparation/comparation.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GraficosComponent,
    AboutUsComponent,
    AccessTokenComponent,
    DomseguroPipe,
    NoimagePipe,
    ReceiptComponent,
    MsToSecondsPipe,
    CharacterSanitizerPipe,
    ComparationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    HttpClientModule,
    MatSelectModule,
    FormsModule,
    FontAwesomeModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
