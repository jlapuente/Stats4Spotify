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
    if (this.isMobile) {
      this.displayedColumns = ['index', 'name', 'artist', 'duration_ms'];
    } else {
      this.displayedColumns = ['index', 'name', 'artist', 'release_date', 'duration_ms'];
    }
    this.getHistory();
/*     this.getSavedTracks();
 */  }

  getHistory(){
    this.loading = true;
    this._spotifyService.getRecentlyPlayed().subscribe((data:any) => {
      console.log(data);
      this.listOfSongs = [];
      data.items.forEach(element => {
        let track = element.track;
        track.played_at = element.played_at;
        this.listOfSongs.push(track);
      });
      console.log(this.listOfSongs);
      this.dataSource = new MatTableDataSource(this.listOfSongs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    })
  }
  
}
