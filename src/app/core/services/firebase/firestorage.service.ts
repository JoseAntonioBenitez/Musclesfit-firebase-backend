import { Injectable } from '@angular/core';
import { getStorage } from 'firebase/storage';
import { FirebaseService } from './firebase-service';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {
 

  constructor(
    private firebase:FirebaseService,
    
  ) { }


  chargeImage(file):Promise<any>{
    return new Promise(async (resolve,reject) => {

      try{
        const data = await this.firebase.imageUpload(file);
        resolve(data);
      } catch (error){
        reject(error);
      }

      
    });

  }
}
