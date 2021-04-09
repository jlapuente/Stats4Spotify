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
    { value: 'short_term', viewValue: 'Last Month' },
    { value: 'medium_term', viewValue: 'Last six months' },
    { value: 'long_term', viewValue: 'From the beginning' }
  ];
  selectedOption = this.selectOptions[0].value;
  
  searchList: SelectOption[] = [
    { value: 'tracks', viewValue: 'Canciones' },
    { value: 'artist', viewValue: 'Artistas' },
  ];
  selectedSearch = this.searchList[1].value;

  user:any;
  membership: string;
  date: any;
  totalTime: number;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
  
    this.year = new Date().getFullYear();
    this.date = new Date();
    this.username = "";
    this.clientId = "";
    this.period = this.selectOptions.find(i => i.value === this.selectedOption).viewValue;
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

    this.updateSearch();
  }


  updateSearch() {
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
          this.totalTime = 0;
          this.totalTime = this.items.reduce((sum, current) => sum + current.duration_ms, 0);
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
