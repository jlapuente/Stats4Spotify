import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SpotifyService } from '../integration/services/spotify.service';
@Component({
  selector: 'app-albumtify',
  templateUrl: './albumtify.component.html',
  styleUrls: ['./albumtify.component.scss']
})
export class AlbumtifyComponent implements OnInit {

  offSet: number = 0;
  // listaCanciones: any[] = [];
  cancionesEncontradas: number = 0;
  mapOfSongs: Map<any, number> = new Map();
  listOfSongs: any[] = [];
  loading: boolean = false;

  constructor(private _spotifyService: SpotifyService, @Inject(DOCUMENT) private document: Document, private translate: TranslateService) { }

  ngOnInit() {
    this.loading = true;
    this.getSavedTracks();
  }

  getSavedTracks() {
    this._spotifyService.getSavedTracks(this.offSet).subscribe((data: any) => {
      data.items.forEach(element => {
        if (element.track.album.album_type.toUpperCase() == "ALBUM") {
          var result = this.listOfSongs.find(obj => {
            // console.log(obj);
            return obj.id == element.track.album.id;
          })
          if (result == undefined) {
            element.track.album.length = 1;
            this.listOfSongs.push(element.track.album);
          } else {
            result.length = result.length + 1;
          }
        }
      });
      this.cancionesEncontradas = data.items.length;
      if (this.cancionesEncontradas != 0) {
        this.offSet += 50;
        this.getSavedTracks();
      } else {
        this.groupSongs();
      }
    }, error => {
      error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());
    });
  }

  groupSongs() {
    this.listOfSongs.sort(function (a, b) { return parseFloat(b.length) - parseFloat(a.length) });
    let temp: any[] = this.listOfSongs;
    temp = this.listOfSongs.filter(element => {
      return element.length > 1;
    })
    if (temp.length < 9) {
      this.listOfSongs = this.listOfSongs.slice(0, 9);
    } else {
      this.listOfSongs = temp.slice(0, 9);
    }

    console.log(temp);
    this.loading = false;
  }

  redirect(url) {
    // console.log(url.spotify);
    this.document.location.href = url.spotify;
  }

}
