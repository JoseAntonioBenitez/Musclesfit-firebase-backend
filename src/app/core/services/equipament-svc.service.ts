import { Injectable } from '@angular/core';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject, map } from 'rxjs';
import { Equipment } from '../model/equipment';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';
import { UserService } from './user.service';



@Injectable({
  providedIn: 'root'
})
export class EquipamentSVCService {
  private _equipmentSubjetc:BehaviorSubject<Equipment[]> = new BehaviorSubject([]);
  public equipment$ = this._equipmentSubjetc.asObservable();

  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('equipment',this._equipmentSubjetc,this.mapEquipment)
   }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapEquipment(doc:DocumentData){
    return{
      id:0,
      docId:doc['id'],
      name_equipment:doc['data']().name_equipment,
      image:doc['data']().image
    };
  }

  getEquipmentById(id:string):any{
    return this.equipment$
      .pipe(
        map(equipments => equipments.find(equipment => equipment.docId === id))
      );
  }

  async deleteEquipment(equipament:Equipment){
    await this.firebase.deleteDocument('equipment',equipament.docId);
  }

  uploadImage(file):Promise<any>{  
    return new Promise(async (resolve, reject)=>{
      try {
        const data = await this.firebase.imageUpload(file);  
        resolve(data);
      } catch (error) {
        resolve(error);
      }
    });
  }

  async addEquipment(equipment:Equipment){
    var _equipment = {
      id:0,
      docId:equipment.docId,
      name_equipment:equipment.name_equipment
    };
    if(equipment['pictureFile']){
      var response:FileUploaded = await this.uploadImage(equipment['pictureFile']);
      _equipment['image'] = response.file;
    }
    try {
      await this.firebase.createDocument('equipment',_equipment);
    }catch(error){
      console.log(error);
    }
  }

  async updateEquipment(equipmentItem:Equipment){
    var _equipment = {
      id:0,
      docId:equipmentItem.docId,
      name_equipment:equipmentItem.name_equipment,
    };
    if(equipmentItem['pictureFile']){
      var response:FileUploaded = await this.uploadImage(equipmentItem['pictureFile']);
      _equipment['image'] = response.file;
    }
    try {
      await this.firebase.updateDocument('equipment', equipmentItem.docId, _equipment);  
    } catch (error) {
      console.log(error);
    }
  }
}

