import { Component, Inject, OnInit} from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS, SelectOption } from '../properties/constants';
import { DOCUMENT } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  songList: any[];
  matriz: any[] = [];

  langSession;
  selectedLanguage;
  selectedItem;
  languages: any[];

  constructor(private _spotifyService: SpotifyService, @Inject(DOCUMENT) private document: Document, private translate: TranslateService) {

    if (this._spotifyService.checkTokenSpo()) {

      this.loading = true;

      this._spotifyService.getTopArtist("long_term", CONSTANTS.SIX_ESCALE).subscribe((data: any) => {

        console.log(this._spotifyService.credentials);
        console.log(data);
        this.songList = data.items;
        this.loading = false;
        // this.createMatriz(this.songList);
      }, error => {

        error.status == 401 && (this._spotifyService.tokenRefreshURL());

      });

    }

  }

  redirect(url){
    // console.log(url.spotify);
    this.document.location.href = url.spotify;
  }

  ngOnInit(){
    this.languages = [
      {value: 'en', label: 'uk'},
      {value: 'es', label: 'spain'},
    ]
    this.langSession = sessionStorage.getItem("lang");
    if(this.langSession.indexOf("-") > 0 ){
      this.langSession = this.langSession.split("-")[0];
    }
    if(this.langSession){
      this.selectedLanguage = this.langSession;
      this.translate.use(this.langSession);
    } else {
      this.selectedLanguage = this.getLang().split("-")[0];
      this.changeLanguage();
    }
    console.log(this.langSession);
  }

  changeLanguage(){
    this.translate.use(this.selectedLanguage);
    sessionStorage.setItem("lang", this.selectedLanguage);
  }

  getLang() {
  if (navigator.languages != undefined)
    return navigator.languages[0];
  return navigator.language;
}
}
