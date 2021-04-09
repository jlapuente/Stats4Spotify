import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS, SelectOption } from '../properties/constants';
import html2canvas from 'html2canvas';
import { saveAs } from '../../../node_modules/file-saver';

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
  selectOptions: SelectOption[] = [
    { value: 'short_term', viewValue: 'Ultimos 3 meses' },
    { value: 'medium_term', viewValue: 'Ultimos 6 meses' },
    { value: 'long_term', viewValue: 'Desde siempre' }
  ];
  selectedOption = this.selectOptions[2].value;
  
  searchList: SelectOption[] = [
    { value: 'tracks', viewValue: 'Canciones' },
    { value: 'artist', viewValue: 'Artistas' },
  ];
  selectedSearch = this.searchList[1].value;

  user:any;
  membership: string;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
  
    this.year = new Date().getFullYear();
    this.username = "";
    this.clientId = "";
    this.period = "Last 6 Months"
    this.url = "https://jlapuente.github.io/Stats4Spotify/";
    this._spotifyService.getCurrentUser().subscribe((data: any) => {
      console.log(data);
      this.user = data;
      this.username = this.user.display_name;
      this.membership = this.user.product;
      // this.loading = false;
    }, error => {
      error.status == 401 && (this._spotifyService.tokenRefreshURL());
    });;
  }


  updateSearch() {
    console.log("he entrado");
    this.period = this.selectOptions.find(i => i.value === this.selectedOption).viewValue;
    if (this._spotifyService.checkTokenSpo()) {
      // this.loading = true;

      if(this.selectedSearch == 'artist'){
        this._spotifyService.getTopArtist(this.selectedOption, CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
          console.log(this._spotifyService.credentials);
          console.log(data);
          this.items = data.items;
          // this.loading = false;
        }, error => {
          error.status == 401 && (this._spotifyService.tokenRefreshURL());
        });
      } else {
        this._spotifyService.getTopTracks2(this.selectedOption, CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
          console.log(this._spotifyService.credentials);
          console.log(data);
          this.items = data.items;
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
}
