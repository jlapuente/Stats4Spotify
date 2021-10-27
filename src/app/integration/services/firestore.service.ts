import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';import { SECRET_CONSTANTS } from 'src/app/properties/secret-constants';
 @Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) { }  
  
  //Crea un nuevo user
  public createUser(data: { id: string, data: string }) {
    return this.firestore.collection(SECRET_CONSTANTS.DB_COLLECTION).add(data);
  }  
  //Obtiene un user
  public getUser(documentId: string) {
    return this.firestore.collection(SECRET_CONSTANTS.DB_COLLECTION, res => res.where('id', '==', documentId)).snapshotChanges();
  }  
  //Obtiene todos los users
  public getUsers() {
    return this.firestore.collection(SECRET_CONSTANTS.DB_COLLECTION).snapshotChanges();
  }
  //Actualiza un user
  public updateUser(documentId: string, data: any) {
    return this.firestore.collection(SECRET_CONSTANTS.DB_COLLECTION).doc(documentId).set(data);
  }
}