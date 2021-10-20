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
  loading = false;
  listOfGenres = [];
  listOfArtist = [];
  clickedRows = [];

  displayedColumns = [];
  offSet = 0;
  dataSource;

  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  
  
  ngOnInit() {
   this.displayedColumns = ['name', 'artist', 'release_date'];
   this.getSavedTracks();
  }

  getSavedTracks(){
    let receivedSongs = [];
    this.loading = true;
    this._spotifyService.getSavedTracks(this.offSet).subscribe((data: any) => {
      console.log(data);
      // this.listaCanciones.push(data.items)
      data.items.forEach(element => {
        this.listOfSongs.push(element.track);
      });
      receivedSongs = data.items;
      if (receivedSongs.length != 0) {
        this.offSet += 50;
        this.getSavedTracks();
      } else {
        this.loading = false;
        this.dataSource = new MatTableDataSource(this.listOfSongs);
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
      }
    }, error => {
      error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());
    }, () => {
    });
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}
