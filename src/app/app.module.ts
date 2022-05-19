import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AboutUsComponent } from './about-us/about-us.component';
import { GraficosComponent } from './graficos/graficos.component';
import { AccessTokenComponent } from './integration/access-token/access-token.component'
import { DomseguroPipe } from './integration/pipes/domseguro.pipe'
import { NoimagePipe } from './integration/pipes/noimage.pipe';
import { DialogComponent, ReceiptComponent } from './receipt/receipt.component';
import { MsToSecondsPipe } from './integration/pipes/ms-to-seconds.pipe'
import { CharacterSanitizerPipe } from './integration/pipes/character-sanitizer.pipe';
import { ComparationComponent } from './comparation/comparation.component';
import { PlayListComponent } from './play-list/play-list.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArtistSanitizerPipe } from './integration/pipes/artist-sanitizer.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { HistorialComponent } from './historial/historial.component';



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const EXTERNAL_MODULES = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    defaultLanguage: 'es',
    useDefaultLang: true
  })
]

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
    ComparationComponent,
    PlayListComponent,
    ArtistSanitizerPipe,
    HistorialComponent,
    DialogComponent
  ],
  entryComponents: [DialogComponent],
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
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    ...EXTERNAL_MODULES,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
