import { Component, OnInit} from '@angular/core';
import html2canvas from 'html2canvas';
import { SpotifyService } from '../integration/services/spotify.service';
import domtoimage from 'dom-to-image';
import { saveAs } from '../../../node_modules/file-saver';
import { CONSTANTS, SelectOption } from '../properties/constants';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading: boolean = false;
  songList: any[];
  matriz: any[] = [];
  foods: SelectOption[] = [
    { value: 'short_term', viewValue: 'Ultimos 3 meses' },
    { value: 'medium_term', viewValue: 'Ultimos 6 meses' },
    { value: 'long_term', viewValue: 'Desde siempre' }
  ];
  selectedFood = this.foods[2].value;

  constructor(private _spotifyService: SpotifyService) {

    if (this._spotifyService.checkTokenSpo()) {

      this.loading = true;

      this._spotifyService.getTopArtist("long_term", CONSTANTS.TWELVE_ESCALE).subscribe((data: any) => {

        console.log(this._spotifyService.credentials);
        console.log(data);
        this.songList = data.items;
        this.loading = false;
        this.createMatriz(this.songList);
      }, error => {

        error.status == 401 && (this._spotifyService.tokenRefreshURL());

      });

    }

  }

  imprimirHTML(){
    html2canvas(document.querySelector("#printableHTML")).then(canvas => {
      console.log(canvas);
      document.body.appendChild(canvas)
    });
  }

  // downloadImage() {
  //   console.log(this.screen);
  //   html2canvas(this.screen.nativeElement).then(canvas => {
  //     // document.body.appendChild(canvas) // => pay attention to this line
  //     // this.canvas.nativeElement.src = canvas.toDataURL();
  //     // this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
  //     // this.downloadLink.nativeElement.download = 'marble-diagram.png';
  //     // this.downloadLink.nativeElement.click();
  //     $('#canvas').replaceWith(canvas);
  //   });
  // }
  downloadImage() {
    domtoimage.toBlob(document.getElementById('printableHTML')).then(function (blob) {
        saveAs(blob, 'my-node.png');
      });
  }

  ngOnInit(){

  }

  createMatriz(array: any[]){
    var res = array.reduce((a, c, i) => {
      return i % 3 === 0 ? a.concat([array.slice(i, i + 3)]) : a;
    }, []);
    this.matriz = res;
    console.log(res)
  }
  
}
