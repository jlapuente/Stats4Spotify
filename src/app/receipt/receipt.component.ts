import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS, SelectOption } from '../properties/constants';
import html2canvas from 'html2canvas';
import { saveAs } from '../../../node_modules/file-saver';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {

  year: number;
  username: string;
  url: string;
  clientId: string;
  period: string;
  items: any[];
  selectOptions: SelectOption[] = [];
  selectedOption: SelectOption;
  selectedSearch: SelectOption;
  searchList: SelectOption[] = [];
  user: any;
  membership: string;
  date: any;
  totalTime: number;

  isArtist: boolean = true;
  
  receipt = true;
  listOfSongs : any[] = [];
  idList = [];
  screenWidth: number = window.screen.width;
  isMobile: boolean = this.screenWidth < 768 ? true : false;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  displayedColumns = [];
  dataSource;
  loading = false;

  constructor(private _spotifyService: SpotifyService, private translate: TranslateService) { }

  ngOnInit() {
    this.initializeCombos();

    this.year = new Date().getFullYear();
    this.date = new Date();
    this.username = "";
    this.clientId = "";
    this.url = "jlapuente.github.io/Stats4Spotify/";

  }

  updateSearch() {
    this.period = (this.selectOptions.find(i => i.value === this.selectedOption.value)).viewValue;
    this.isArtist = this.selectedSearch.value == this.searchList[1].value;
    if (this._spotifyService.checkTokenSpo()) {
      // this.loading = true;
      if (this.selectedSearch.value == 'artist') {
        this._spotifyService.getTopArtist(this.selectedOption.value, CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
          this.items = data.items;
          this.membership = this._spotifyService.user.product;
          this.username = this._spotifyService.user.display_name;
          // this.loading = false;
        }, error => {
          error.status == 401 && (this._spotifyService.tokenRefreshURL());
        });
      } else {
        this._spotifyService.getTopTracks2(this.selectedOption.value, CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
          this.totalTime = 0;
          this.totalTime = this.items.reduce((sum, current) => sum + current.duration_ms, 0);
          this.membership = this._spotifyService.user.product;
          this.username = this._spotifyService.user.display_name;
          // this.loading = false;
        }, error => {
          error.status == 401 && (this._spotifyService.tokenRefreshURL());
        });
      }
    }
  }
  downloadImage() {
    html2canvas(document.getElementById("receiptContainer")).then(function (canvas) {
      canvas.toBlob(function (blob) {
        saveAs(blob, "receipt.png");
      });
    });
  }

  initializeCombos(){
    // We prepare the combos with the translations
    this.translate.get('RECEIPT.SONGS').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = 'tracks';
      option.viewValue = res;
      this.searchList.push(option);
    });
    this.translate.get('RECEIPT.ARTIST').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = 'artist';
      option.viewValue = res;
      this.searchList.push(option);
    });
    this.translate.get('RECEIPT.LAST_MONTH').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = 'short_term';
      option.viewValue = res;
      this.selectOptions.push(option);
    });
    this.translate.get('RECEIPT.LAST_SIX_MONTHS').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = 'medium_term';
      option.viewValue = res;
      this.selectOptions.push(option);
    });
    this.translate.get('RECEIPT.FROM_THE_BEGINNING').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = 'long_term';
      option.viewValue = res;
      this.selectOptions.push(option);
      console.log(this.selectOptions);
      console.log(this.searchList);
      this.selectedOption = this.selectOptions[0];
      this.selectedSearch = this.searchList[1];
      this.updateSearch();
    });
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

  createList() {
    this.getIds();
    console.log(this.idList);
    this.loading = true;
    this._spotifyService.createPlaylist('Mi top 50 canciones', this._spotifyService.user.id).subscribe((data: any) => {
      this._spotifyService.addSongsToPlayList(data.id, this.idList).subscribe(data2 => {
        console.log("Playlist creada y canciones añadidas");
        this.loading = false;
      })
    })
  }

  changeView(){
    this.receipt = !this.receipt;
    if(this.receipt){

    } else {
      if (this.isMobile) {
        this.displayedColumns = ['index', 'name', 'artist', 'duration_ms'];
      } else {
        this.displayedColumns = ['index', 'name', 'artist', 'release_date', 'duration_ms'];
      }
      this.getSavedTracks();
    }
  }

}
