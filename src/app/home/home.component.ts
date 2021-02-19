import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { map } from 'rxjs/operators';
import { SpotifyService } from '../integration/services/spotify.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading: boolean = false;

  constructor(private _spotifyService: SpotifyService) {

    if (this._spotifyService.checkTokenSpo()) {

      this.loading = true;

      this._spotifyService.getNewReleases().subscribe((data: any) => {

        console.log(this._spotifyService.credentials);
        console.log(data);
        this.loading = false;

      }, error => {

        error.status == 401 && (this._spotifyService.tokenRefreshURL());

      });

    }

  }

  ngOnInit(){
    
  }
  
}
