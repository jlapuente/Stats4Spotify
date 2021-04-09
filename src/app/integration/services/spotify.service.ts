import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators/';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  public credentials = {
    clientId: '9bdfac8401034ea5afed42d92faec30f',
    clientSecret: '25bf7efed7424019a632ebf6520be15e',
    accessToken: '',
    redirect_uri: 'http://localhost:4200/' // Your redirect uri
    // redirect_uri: 'https://jlapuente.github.io/Stats4Spotify/' // Your redirect uri PRO
  };
  scopes: string = 'user-library-read,user-read-private, user-top-read, playlist-modify-private, playlist-modify-public';
  public poolURlS = {

    authorize: 'https://accounts.spotify.com/es-ES/authorize?client_id=' +
      this.credentials.clientId + '&response_type=token' +
      (this.scopes ? '&scope=' + encodeURIComponent(this.scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(this.credentials.redirect_uri),
    refreshaAcessToken: 'https://accounts.spotify.com/api/token'
  };
  user: any;
  songs = [];

  constructor(private _httpClient: HttpClient) {
    this.upDateToken()
  }

  upDateToken() {
    this.credentials.accessToken = sessionStorage.getItem('token') || '';
  }

  getInfo(query: string) {
    const URL = `https://api.spotify.com/v1/${query}`;
    const HEADER = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.credentials.accessToken }) };
    return this._httpClient.get(URL, HEADER);
  }

  postInfo(query: string, body: any) {
    const URL = `https://api.spotify.com/v1/${query}`;
    const HEADER = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.credentials.accessToken }) };
    return this._httpClient.post(URL, body, HEADER);
  }

  checkTokenSpoLogin() {
    this.checkTokenSpo() || (sessionStorage.setItem('refererURL', location.href), window.location.href = this.poolURlS.authorize);
  }

  checkTokenSpo() {
    return !!this.credentials.accessToken;
  }

  tokenRefreshURL() {
    this.checkTokenSpo() && alert('Expiro la sesión');
    this.credentials.accessToken = '';
    sessionStorage.removeItem('token');
    this.checkTokenSpoLogin();

  }

  getNewReleases() {

    return this.getInfo('browse/new-releases?limit=4&offset=0').pipe(map((data: any) => data.albums.items));

  }

  getArtistas(v: string) {

    return this.getInfo(`search?q=${v}&type=artist&limit=50&offset=0`).pipe(map((data: any) => data.artists.items));

  }

  getArtista(v: string) {

    return this.getInfo(`artists/${v}`);

  }

  getTopTracks(v: string) {

    return this.getInfo(`artists/${v}/top-tracks?country=es`);

  }

  getTopTracks2(v: string, limit: number) {
    return this.getInfo(`me/top/tracks?time_range=${v}&limit=${limit}`)
  }

  getTopArtist(v: string, limit: number) {
    return this.getInfo(`me/top/artists?time_range=${v}&limit=${limit}`)
  }
  getSavedTracks(offset: number) {
    return this.getInfo(`me/tracks?offset=${offset}&limit=50`)
  }

  getTopSavedTracks(v: any[]) {
    let ids = "";
    v.forEach(item => {
      ids = ids.concat(item.id + ',');
    })
    ids = ids.substring(0, ids.length - 1);
    return this.getInfo(`me/tracks/contains?ids=${ids}`)
  }
  getRecentlyPlayed() {
    return this.getInfo(`me/player/recently-played?limit=50`)
  }
  getRecomendations() {
    return this.getInfo(`recommendations?limit=4`)
  }

  addSongsToPlayList(playListId: string, idList: any[]) {
    let body = {
      'uris': idList,
    }
    return this.postInfo(`playlists/` + playListId + `/tracks`, body);
  }
  createPlaylist(name: string, userId: string) {
    let body = {
      name: name,
      description: 'desc'
    }
    return this.postInfo(`users/` + userId + `/playlists?`, body);
  }

  getCurrentUser() {
    return this.getInfo(`me`);
  }

  createAndAddPlaylist(name: string, userId: string, idList: any[]) {
    this.createPlaylist(name, userId).subscribe((data: any) => {
      console.log(data);
      this.addSongsToPlayList(data.id, idList).subscribe((data: any) => {
        console.log(data);
      }, error => {
        error.status == 401 && (this.tokenRefreshURL());
      });;
    }, error => {
      error.status == 401 && (this.tokenRefreshURL());
    });;
  }

}
