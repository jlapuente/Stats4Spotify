import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SpotifyService } from '../integration/services/spotify.service';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.scss']
})
export class PlayListComponent implements OnInit {

  constructor(private _spotifyService: SpotifyService) { }

  listOfSongs: any[] = [];
  filteredSongs: any[] = [];
  loading = false;
  listOfGenres = [];
  listOfArtist = [];
  clickedRows = [];

  displayedColumns = [];
  offSet = 0;
  dataSource;

  // Filters
  artist: string = '';
  songName: string = '';
  playlistName: string = '';

  // Second datatable
  alternativeList = [];
  alternativeDataSource;
  mapOfArtist = new Map<String, any>();

  @ViewChild(MatPaginator, null) paginator: MatPaginator;


  ngOnInit() {
    this.displayedColumns = ['name', 'artist', 'release_date'];
    this.getSavedTracks();
  }

  getSavedTracks() {
    let receivedSongs = [];
    this.loading = true;
    this._spotifyService.getSavedTracks(this.offSet).subscribe((data: any) => {
      console.log(data);
      // this.listaCanciones.push(data.items)
      data.items.forEach(element => {
        this.listOfSongs.push(element.track);
      });
      receivedSongs = data.items;
      this.loading = false;
      this.dataSource = new MatTableDataSource(this.listOfSongs);
      this.dataSource.paginator = this.paginator;
      /*         this.getArtists(); */
      if (receivedSongs.length != 0) {
        this.offSet += 50;
        this.getSavedTracks();
      } else {
        this.loading = false;
        this.dataSource = new MatTableDataSource(this.listOfSongs);
        this.dataSource.paginator = this.paginator;
      }
    }, error => {
      error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());
    }, () => {
    });
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
    if (this.alternativeList.indexOf(row) < 0) {
      this.alternativeList.push(row);
    } else {
      let posOfSong = this.alternativeList.findIndex(element => element.id == row.id);
      this.alternativeList.splice(posOfSong, 1);
    }
    this.alternativeDataSource = new MatTableDataSource(this.alternativeList);
    this.dataSource.paginator = this.paginator;
  }

  filterSearch() {
    this.filteredSongs = this.listOfSongs;
    if (this.artist) {
      this.filteredSongs = this.listOfSongs.filter((song) => song.artists.find(artista => artista.name.toLowerCase().indexOf(this.artist.toLocaleLowerCase()) !== -1));
    }
    if (this.songName) {
      this.filteredSongs = this.filteredSongs.filter((song) => song.name.toLowerCase().indexOf(this.songName.toLocaleLowerCase()) !== -1);
    }
    this.dataSource = new MatTableDataSource(this.filteredSongs);
    this.dataSource.paginator = this.paginator;

  }

  clear() {
    this.artist = '';
    this.songName = '';
    this.playlistName = '';
    this.dataSource = new MatTableDataSource(this.listOfSongs);
    this.dataSource.paginator = this.paginator;
  }

  createList() {
    if (this.playlistName === "") {
      console.log("error");
      return;
    }
    let idList = [];
    this.alternativeList.forEach(element => {
      idList.push(element.uri);
    });
    this.loading = true;
    this._spotifyService.createAndAddPlaylist(this.playlistName, this._spotifyService.user.id, idList).subscribe((data: any) => {
      console.log(data);
      if (idList.length !== 0) {
        this._spotifyService.addSongsToPlayList(data.id, idList).subscribe((data2: any) => {
          console.log(data2);
          this.loading = false;
        }, error => {
          error.status == 401 && (this._spotifyService.tokenRefreshURL());
        });
      } else {
        this.loading = false;
      }
    }, error => {
      error.status == 401 && (this._spotifyService.tokenRefreshURL());
    });
  }
  /* getArtists(){
    let counter = 0;
    this.listOfSongs.forEach(song => {
      counter++;
      let songCounter = 0;
      song.artists.forEach(artist => {
        songCounter++;
        this._spotifyService.getArtista(artist.id).subscribe((data2: any) => {
          this.mapOfArtist.set(data2.name, data2);
          if(this.listOfSongs.length == counter && song.artists.length == songCounter){
            console.log(this.mapOfArtist);
          }
        })
      });
    });
  } */
}
