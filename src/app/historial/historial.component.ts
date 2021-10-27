import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS } from '../properties/constants';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {

  constructor(private _spotifyService: SpotifyService) { }

  listOfSongs: any[] = [];
  idList: any[] = [];
  filteredSongs: any[] = [];
  loading = false;
  listOfGenres = [];
  listOfArtist = [];
  clickedRows = [];

  displayedColumns = [];
  dataSource;

  screenWidth: number = window.screen.width;
  isMobile: boolean = this.screenWidth < 768 ? true : false;

  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;

  ngOnInit() {
    console.log(this.screenWidth);
    console.log(this.isMobile);
    if (this.isMobile) {
      this.displayedColumns = ['index', 'name', 'artist', 'duration_ms'];
    } else {
      this.displayedColumns = ['index', 'name', 'artist', 'release_date', 'duration_ms'];
    }
    this.getSavedTracks();
  }

  getSavedTracks() {
    this.loading = true;
    this._spotifyService.getTopTracks2('long_term', 50).subscribe((data: any) => {
      console.log(data);
      data.items.forEach(element => {
        this.listOfSongs.push(element)
      });
      console.log(this.listOfSongs);
      this.loading = false;
      this.dataSource = new MatTableDataSource(this.listOfSongs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());
    });
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
    this.createList();
  }

  getIds() {
    this.idList = this.listOfSongs.map(obj => {
      return obj.uri
    });
  }

  createList(){
    this.getIds();
    console.log(this.idList);
    this._spotifyService.createFullPlayList('Mi top 50 canciones', this._spotifyService.user.id, this.idList).then(data =>{
      console.log(data);
    })
  }
  
}
