import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators/';
import { SECRET_CONSTANTS } from '../../properties/secret-constants';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})

export class SpotifyService {
  public credentials = {
    clientId: SECRET_CONSTANTS.client_id,
    clientSecret: SECRET_CONSTANTS.secret_id,
    accessToken: '',
    redirect_uri: SECRET_CONSTANTS.redirect_uri
  };
  scopes: string = 'user-library-read,user-read-private, user-top-read, playlist-modify-private, playlist-modify-public';

  public poolURlS = {

    authorize: 'https://accounts.spotify.com/es-ES/authorize?client_id=' +
      this.credentials.clientId + '&response_type=token' +
      (this.scopes ? '&scope=' + encodeURIComponent(this.scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(this.credentials.redirect_uri),
    refreshaAcessToken: 'https://accounts.spotify.com/api/token'
  };
  user: any = null;
  songs = [];

  constructor(private _httpClient: HttpClient, private _fireStoreService: FirestoreService) {
    if (sessionStorage.getItem('user') == null || this.user == null) {
      this.updateToken()
    }
  }

  updateToken() {
    this.credentials.accessToken = sessionStorage.getItem('token') || '';
    if (this.user == undefined) {
      this.getCurrentUser().subscribe((data: any) => {
        this.user = data;
        sessionStorage.setItem('user', this.user);

        let fireBaseData = { 'id': this.user.id, 'data': this.user };
        this._fireStoreService.getUser(this.user.id).pipe(map(list => {
          return list.map(item => {
            return { id: item.payload.doc.id, user: item.payload.doc.data() }
          })
        })).subscribe(data2 => {
          if (data2[0] == undefined) {
            console.log("No existe el usuario")
            this._fireStoreService.createUser(fireBaseData).then(() => {
              console.log('Usuario creado exitósamente!');
            }, (error) => {
              console.error(error);
            });
          } else {
            console.log(data2[0].user);
          }
        });
        console.log(data)
      }, error => {
        error.status == 401 && (this.tokenRefreshURL());
      })
    } else {
      window.location.href = this.credentials.redirect_uri;
    }
  }

  getInfo(query: string) {
    const URL = `https://api.spotify.com/v1/${query}`;
    const HEADER = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.credentials.accessToken }) };
    return this._httpClient.get(URL, HEADER);
  }

  postInfo(query: string, body: any) {
    const URL = `https://api.spotify.com/v1/${query}`;
    const HEADER = { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.credentials.accessToken }) };
    console.log('header', HEADER)
    return this._httpClient.post(URL, body, HEADER);
  }

  checkTokenSpoLogin() {
    console.log(this.checkTokenSpo())
    console.log(this.poolURlS.authorize)
    console.log(location.href);
    this.checkTokenSpo() || (sessionStorage.setItem('refererURL', location.href), window.location.href = this.poolURlS.authorize);
  }

  checkTokenSpo() {
    // console.log(!!this.credentials.accessToken);
    // console.log(this.credentials.accessToken);
    return !!this.credentials.accessToken;
  }

  tokenRefreshURL() {
    this.checkTokenSpo() && alert('Expiro la sesión');
    this.credentials.accessToken = '';
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
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
  createPlaylist(name: string, userId: string, desc: string) {
    let body = {
      name: name,
      description: desc
    }
    return this.postInfo(`users/` + userId + `/playlists?`, body);
  }

  getCurrentUser() {
    return this.getInfo(`me`);
  }
  getTrack(id) {
    return this.getInfo(`tracks/` + id);
  }

  createAndAddPlaylist(name: string, userId: string, idList: any[], desc: string) {
    return this.createPlaylist(name, userId, desc);
  }

  createFullPlayList(name: string, userId: string, idList: any[], desc) {
    this.createPlaylist(name, userId, desc).subscribe((data: any) => {
      this.addSongsToPlayList(data.id, idList).subscribe(data2 => {
        return data2;
      });
    }, error => {
      return error;
    })
  }
}
