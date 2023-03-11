import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
@Component({
  selector: 'app-albumtify',
  templateUrl: './albumtify.component.html',
  styleUrls: ['./albumtify.component.scss']
})
export class AlbumtifyComponent implements OnInit {

  offSet: number = 0;
  listaCanciones: any[] = [];
  cancionesEncontradas: number = 0;
  mapOfSongs: Map<any, number> = new Map();
  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
    this.getSavedTracks();
  }

  getSavedTracks() {
    this._spotifyService.getSavedTracks(this.offSet).subscribe((data: any) => {
      data.items.forEach(element => {
        if(element.track.album.album_type.toUpperCase() == "ALBUM")
        if(this.mapOfSongs.get(element.track.album.uri) == null){
          this.mapOfSongs.set(element.track.album.uri, 1);
        } else {
          this.mapOfSongs.set(element.track.album.uri, this.mapOfSongs.get(element.track.album.uri) +1 );
        }


        this.listaCanciones.push(element);
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

  groupSongs(){
    this.mapOfSongs.forEach((value: number, key: any) => {
      console.log(value);
      if(value == 1){
        this.mapOfSongs.delete(key);
      }
    });
    console.log(this.mapOfSongs);
    const mapSort1 = new Map([...this.mapOfSongs.entries()].sort((a, b) => b[1] - a[1]));
    console.log(mapSort1);
  }
}
