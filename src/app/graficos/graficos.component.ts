import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../node_modules/chart.js'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { SpotifyService } from '../integration/services/spotify.service.js';
import { CONSTANTS } from '../properties/constants.js';
declare var $:any;

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})


export class GraficosComponent implements OnInit {

  constructor(private _spotifyService: SpotifyService) { }
  genreGraph: object;
  listaArtistas: any[] = [];
  listaGeneros: Grafica[] = [];
  listaValores = [];
  listaCanciones = []; 
  listaSongs = []
  offSet = 0;
  faInfoCircle = faInfoCircle;
  $: any;


  explicacionGraficaGeneros = "Esta gráfica muestra los géneros mas repetidos entre tus cincuenta artistas mas escuchados. Este dato se toma de los artistas y no de las canciones por como Spotify almacena los datos, por lo tanto, no es 100% preciso, ya que un artista puede tener una mayoria de canciones de un mismo género y una minoria de otro distinto."
  explicacionGraficaArtistas = "Esta gráfica muestra los artistas de tu biblioteca de los que mas canciones tienes guardadas. El número que se muestra en la gráfica es la cantidad de canciones que tienes guardadas en <u>'Canciones que te gustan'</u> "
  // itemGeneros: object = { 'label' : string, 'value' : number };

  colors: string[] = [
    'rgba(255, 173, 173, 0.6)',
    'rgba(255, 214, 165, 0.6)',
    'rgba(253, 255, 182, 0.6)',
    'rgba(202, 255, 191, 0.6)',
    'rgba(155, 246, 255, 0.6)',
    'rgba(160, 196, 255, 0.6)',
    'rgba(189, 178, 255, 0.6)',
    'rgba(255, 198, 255, 0.6)',
  ];
  borderColors: string[] = [
    'rgba(255, 198, 255, 1)',
  ]
  ngOnInit() {

    // Inicializamos los tooltips
    $('[data-toggle="tooltip"]').tooltip();

    this.getArtists();
    
    let offSet = 0;
    this.getSavedTracks();
  }

  
  getSavedTracks(){
    this._spotifyService.getSavedTracks(this.offSet).subscribe((data: any) => {
      console.log(data);
      // this.listaCanciones.push(data.items)
      data.items.forEach(element => {
        this.listaCanciones.push(element);
      });
      this.listaSongs = data.items;
      if(this.listaSongs.length != 0){
        this.offSet += 50;
        this.getSavedTracks();
      } else {
        this.groupSongs();
      }
    }, error => {
      error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());
    }, () => {
    });
  }

  groupSongs(){
    let mapOfArtist = new Map;
    this.listaCanciones.forEach(item => {
      item.track.artists.forEach(artista => {
        mapOfArtist.set(artista.name, mapOfArtist.has(artista.name) ? mapOfArtist.get(artista.name) + 1 : 1);
      });
    });
    this.listaCanciones =[];
    this.listaCanciones = this.mapToSortedArray(mapOfArtist, this.listaCanciones);
    let labels = [];
      let values = [];
      this.listaCanciones.forEach(element => {
        labels.push(element.label);
        values.push(element.value);
      })
    this.generateGenreGraph(labels, values, 'artist');
  }


  generateGenreGraph(labels, values, graph) {

    var canvas: any = document.getElementById(graph);
    var ctx = canvas.getContext('2d');
    this.genreGraph = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: '# of times seen',
          data: values,
          backgroundColor: this.colors,
          borderColor: this.borderColors,
          borderWidth: 1
        }]
      },
      // options: {
      //   chartArea: {
      //     backgroundColor: 'rgba(255, 255, 252, 1)'
      //   },
      // }
    });
  }
  getArtists() {
    // this.loading = true;
    let myhash = new Map;
    this._spotifyService.getTopArtist("long_term", CONSTANTS.TEN_ESCALE).subscribe((data: any) => {
      this.listaArtistas = data.items;
      this.listaArtistas.forEach(element => {
        let artista: any = element;
        artista.genres.forEach(genero => {
          myhash.set(genero, myhash.has(genero) ? myhash.get(genero) + 1 : 1);
        });
      });
      this.listaGeneros = this.mapToSortedArray(myhash, this.listaGeneros);

      let labels = [];
      let values = [];
      this.listaGeneros.forEach(element => {
        labels.push(element.label);
        values.push(element.value);
      })
      this.generateGenreGraph(labels, values, 'genres');
      // this.loading = false;
    }, error => {
      error.status == 401 || error.status == 400 && (this._spotifyService.tokenRefreshURL());
    });


  }
  mapToSortedArray(map, list){
    map.forEach((value: number, key: string) => {
      let graph = new Grafica;
      graph.label = key;
      graph.value = value;
      list.push(graph);
    });
    list.sort(this.compare);
    list = list.splice(0, 8);
    return list;
  }
  compare(a, b) {
    if ( a.value > b.value ){
      return -1;
    }
    if ( a.value < b.value ){
      return 1;
    }
    return 0;
  }

  openModal(text : string){
    $('.modal-body>p').html(text);
    $('#myModal').modal('toggle');
  }
  
}
export class Grafica {
  label: string;
  value: number;
}
