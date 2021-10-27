import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SpotifyService } from '../integration/services/spotify.service';
import { CONSTANTS, SelectOption } from '../properties/constants';
import html2canvas from 'html2canvas';
import { saveAs } from '../../../node_modules/file-saver';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private _spotifyService: SpotifyService, private translate: TranslateService) { }

  ngOnInit() {
    this.initializeCombos();

    this.year = new Date().getFullYear();
    this.date = new Date();
    this.username = "";
    this.clientId = "";
    this.url = "jlapuente.github.io/Stats4Spotify/";
    this._spotifyService.getCurrentUser().subscribe((data: any) => {
      this.user = data;
      this.username = this.user.display_name;
      this.membership = this.user.product;
      // this.loading = false;
    }, error => {
      error.status == 401 && (this._spotifyService.tokenRefreshURL());
    });
  }

  updateSearch() {
    this.period = (this.selectOptions.find(i => i.value === this.selectedOption.value)).viewValue;
    // this.selectOptions.forEach(i => {
    //   if(i.value === this.selectedOption.value){
    //     this.period = i.viewValue;
    //   }
    // })
    console.log(this.period);
    this.isArtist = this.selectedSearch.value == this.searchList[1].value;
    if (this._spotifyService.checkTokenSpo()) {
      // this.loading = true;
      if (this.selectedSearch.value == 'artist') {
        this._spotifyService.getTopArtist(this.selectedOption.value, CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
          this.items = data.items;
          // this.loading = false;
        }, error => {
          error.status == 401 && (this._spotifyService.tokenRefreshURL());
        });
      } else {
        this._spotifyService.getTopTracks2(this.selectedOption.value, CONSTANTS.TEN).subscribe((data: any) => {
          console.log(data.items);
          /* data.items.forEach(element => {
            console.log(element.name);
          });
          this.items = data.items.splice(0, 10); */
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

}
