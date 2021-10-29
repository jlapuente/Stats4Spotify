import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS, SelectOption } from '../properties/constants';
import html2canvas from 'html2canvas';
import { saveAs } from '../../../node_modules/file-saver';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {
  
  constructor(private _spotifyService: SpotifyService, private translate: TranslateService) { }

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

  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  receipt = true;
  listOfSongs: any[] = [];
  idList = [];
  screenWidth: number = window.screen.width;
  isMobile: boolean = this.screenWidth < 768 ? true : false;
  displayedColumns = [];
  dataSource = new MatTableDataSource();
  loading = false;

  ngOnInit() {
    this.initializeCombos();
  }

  updateSearch() {
    this.period = (this.selectOptions.find(i => i.value === this.selectedOption.value)).viewValue;
    if (this.receipt) {
      this.getReceipt()
    } else {
      this.getSavedTracks(true);
    }
  }

  getReceipt() {
    this.isArtist = this.selectedSearch.value == this.searchList[1].value;
    this.year = new Date().getFullYear();
    this.date = new Date();
    this.username = "";
    this.clientId = "";
    this.url = "jlapuente.github.io/Stats4Spotify/";
    this.loading = true;

    if (this.selectedSearch.value == 'artist') {
      this._spotifyService.getTopArtist(this.selectedOption.value, CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
        this.items = data.items;
        this.membership = this._spotifyService.user.product;
        this.username = this._spotifyService.user.display_name;
        this.loading = false;
      }, error => {
        error.status == 401 && (this._spotifyService.tokenRefreshURL());
      });
    } else {
      this._spotifyService.getTopTracks2(this.selectedOption.value, CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
        this.items = data.items;
        this.totalTime = 0;
        this.totalTime = this.items.reduce((sum, current) => sum + current.duration_ms, 0);
        this.membership = this._spotifyService.user.product;
        this.username = this._spotifyService.user.display_name;
        this.loading = false;
      }, error => {
        error.status == 401 && (this._spotifyService.tokenRefreshURL());
      });
    }
  }

  downloadImage() {
    html2canvas(document.getElementById("receiptContainer")).then(function (canvas) {
      canvas.toBlob(function (blob) {
        saveAs(blob, "receipt.png");
      });
    });
  }

  initializeCombos() {

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
      this.selectedOption = this.selectOptions[0];
      this.selectedSearch = this.searchList[1];
      this.updateSearch();
    });
  }

  getSavedTracks(updateSearch) {
    console.log(updateSearch);
    this.displayedColumns =  this.isMobile? ['index', 'name', 'artist'] : ['index', 'name', 'artist'];
    if (this.listOfSongs.length == 0 || updateSearch) {
      this.loading = true;
      this._spotifyService.getTopTracks2(this.selectedOption.value, 50).subscribe((data: any) => {
        this.listOfSongs = [];
        data.items.forEach((element, index) => {
          element.index = index + 1;
          this.listOfSongs.push(element)
        });
        this.loading = false;
        this.dataSource = new MatTableDataSource(this.listOfSongs);
        this.dataSource.paginator = this.paginator;
      }, error => {
        this.loading = false;
        error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());
      });
    } else {
      this.paginator = this.dataSource.paginator;
    }
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  getIds() {
    this.idList = this.listOfSongs.map(obj => {
      return obj.uri
    });
  }

  createList() {
    this.getIds();
    this.loading = true;
    this._spotifyService.createPlaylist('Mi top 50 canciones - ' + this.selectedOption.viewValue, this._spotifyService.user.id).subscribe((data: any) => {
      this._spotifyService.addSongsToPlayList(data.id, this.idList).subscribe(() => {
        console.log("Playlist creada y canciones añadidas");
        this.loading = false;
      })
    })
  }

  changeView() {
/*     var downloadButton = <HTMLInputElement>document.getElementById('download-button');
 */    this.receipt = !this.receipt;
    if (this.receipt) {
/*       downloadButton.disabled = false;
 */      if (this.items.length == 0) {
        this.updateSearch()
      }
    } else {
/*       downloadButton.disabled = true;
 */      this.getSavedTracks(false);
    }
  }

}
