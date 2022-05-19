import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS, SelectOption } from '../properties/constants';
import html2canvas from 'html2canvas';
import { saveAs } from '../../../node_modules/file-saver';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, MatSnackBar, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {

  constructor(private _spotifyService: SpotifyService, private translate: TranslateService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

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


  readonly TRACKS = 'tracks';
  readonly ARTIST = 'artist';

  readonly SHORT_TERM = "short_term";
  readonly MEDIUM_TERM = "medium_term";
  readonly LONG_TERM = "long_term";

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
    this.isArtist = this.selectedSearch.value == this.ARTIST;
    this.year = new Date().getFullYear();
    this.date = new Date();
    this.username = "";
    this.clientId = "";
    this.url = "jlapuente.github.io/Stats4Spotify/";
    this.loading = true;

    if (this.selectedSearch.value == this.ARTIST) {
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
    if (this.selectedSearch.value == this.TRACKS){
      this.openDialog();
    }
  }

  initializeCombos() {

    // We prepare the combos with the translations
    this.translate.get('RECEIPT.SONGS').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = this.TRACKS;
      option.viewValue = res;
      this.searchList.push(option);
    });

    this.translate.get('RECEIPT.ARTIST').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = this.ARTIST;
      option.viewValue = res;
      this.searchList.push(option);
    });

    this.translate.get('RECEIPT.LAST_MONTH').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = this.SHORT_TERM;
      option.viewValue = res;
      this.selectOptions.push(option);
    });

    this.translate.get('RECEIPT.LAST_SIX_MONTHS').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = this.MEDIUM_TERM;
      option.viewValue = res;
      this.selectOptions.push(option);
    });

    this.translate.get('RECEIPT.FROM_THE_BEGINNING').subscribe((res: string) => {
      let option = new SelectOption();
      option.value = this.LONG_TERM;
      option.viewValue = res;
      this.selectOptions.push(option);
      this.selectedOption = this.selectOptions[0];
      this.selectedSearch = this.searchList[1];
      this.updateSearch();
    });
  }

  getSavedTracks(updateSearch) {
    console.log(updateSearch);
    this.displayedColumns = ['index', 'name', 'artist'];
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

  getIds(items) {
    this.idList = items.map(obj => {
      return obj.uri
    });
  }

  createList() {
    this.getIds(this.listOfSongs);
    this.loading = true;
    this._spotifyService.createPlaylist('Mi top 50 canciones - ' + this.selectedOption.viewValue, this._spotifyService.user.id, "Playlist con las 50 canciones mas escuchadas de " + this.username).subscribe((data: any) => {
      this._spotifyService.addSongsToPlayList(data.id, this.idList).subscribe(() => {
        console.log("Playlist creada y canciones añadidas");
        this.loading = false;
      })
    })
  }

  changeView() {
    this.receipt = !this.receipt;
    if (this.receipt) {
      if (this.items.length == 0) {
        this.updateSearch()
      }
    } else {
      this.getSavedTracks(false);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTopList();
      }
    });
  }

  createTopList() {
    this.getIds(this.items);
    this.loading = true;
    this._spotifyService.createPlaylist('Mi top 10 canciones - ' + this.selectedOption.viewValue, this._spotifyService.user.id, "Playlist con las 10 canciones mas escuchadas por " + this.username + " a fecha de " + this.date).subscribe((data: any) => {
      this._spotifyService.addSongsToPlayList(data.id, this.idList).subscribe(() => {
        console.log("Playlist creada y canciones añadidas");
        this.loading = false;
        this.snackBar.open('Playlist creada', '', {
          duration: 4000,
          panelClass: ['spotify-snackbar']
        });
      }, error => {
        this.snackBar.open('Error al crear la playlist', '', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      })
    })
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog.component.html',
})
export class DialogComponent { }
