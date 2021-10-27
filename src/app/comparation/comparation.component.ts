import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../integration/services/firestore.service';
import { SpotifyService } from '../integration/services/spotify.service';

@Component({
  selector: 'app-comparation',
  templateUrl: './comparation.component.html',
  styleUrls: ['./comparation.component.scss']
})
export class ComparationComponent implements OnInit {

  constructor(private firestoreService: FirestoreService, private _spotifyService: SpotifyService) { } 
  
  public cats = []; 
  
  ngOnInit() {

    this.firestoreService.getUser(this._spotifyService.user.id).subscribe(data =>{
      console.log(data);
    })
    

    this.firestoreService.getUsers().subscribe((catsSnapshot) => {
      console.log(catsSnapshot);
      this.cats = [];
      catsSnapshot.forEach((catData: any) => {
        this.cats.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data()
        });
      })
    });
  }
}
