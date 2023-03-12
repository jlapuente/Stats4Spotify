import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { PreviousRouteService } from './integration/services/previous-route.service';
import { SpotifyService } from './integration/services/spotify.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Stats4Spotify';
  @ViewChild(MatSidenav, { static: true }) sidenav: MatSidenav;
  events: string[] = [];
  opened: boolean = false;

  constructor(private _activatedRoute: ActivatedRoute, private _location: Location, private _previousRouteService: PreviousRouteService,
    private _router: Router, private _SpotifyService: SpotifyService) {
    this._previousRouteService.registerUrls();
    this._router.events.subscribe(data => {
      console.log('data', data);
      if (data instanceof RoutesRecognized) {
        let anchor = data.url;
        console.log(anchor);
        let token = anchor.split('=');
        token[1] = token[1].replace('token_type', '')
        console.log(token[1]);
        sessionStorage.setItem('token', token[1]), this._SpotifyService.updateToken()

      //   const URL = this._location.path();
      //   if (URL.split('=')[0] === 'access_token') {
      //     let param = this.getHashParams(URL);
      //     console.log(param);
      //     const NewToken = param['access_token'];
      //     NewToken && (sessionStorage.setItem('token', NewToken), this._SpotifyService.updateToken());
      //   }
      }
    });
  }
  getHashParams(q) {
    let hashParams = {}, e, r = /([^&;=]+)=?([^&;]*)/g;
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    console.log(e)
    console.log(r)
    console.log(hashParams)
    return hashParams;
  }
}
