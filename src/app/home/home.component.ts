import { Component, Inject, OnInit} from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS, SelectOption } from '../properties/constants';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  songList: any[];
  matriz: any[] = [];

  constructor(private _spotifyService: SpotifyService, @Inject(DOCUMENT) private document: Document) {

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

  }
}
