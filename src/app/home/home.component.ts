import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import html2canvas from 'html2canvas';
import { map } from 'rxjs/operators';
import { SpotifyService } from '../integration/services/spotify.service';

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

  foods: Food[] = [
    { value: 'short_term', viewValue: 'Ultimos 3 meses' },
    { value: 'medium_term', viewValue: 'Ultimos 6 meses' },
    { value: 'long_term', viewValue: 'Desde siempre' }
  ];
  selectedFood = this.foods[2].value;

  @ViewChild('screen', { static: false }) screen: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef;

  constructor(private _spotifyService: SpotifyService) {

    if (this._spotifyService.checkTokenSpo()) {

      this.loading = true;

      this._spotifyService.getTopArtist("long_term").subscribe((data: any) => {

        console.log(this._spotifyService.credentials);
        console.log(data);
        this.songList = data.items;
        this.loading = false;

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

  downloadImage() {
    console.log(this.screen);
    html2canvas(this.screen.nativeElement).then(canvas => {
      document.body.appendChild(canvas) // => pay attention to this line
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'marble-diagram.png';
      this.downloadLink.nativeElement.click();
    });
  }

  ngOnInit(){

  }
  
}
