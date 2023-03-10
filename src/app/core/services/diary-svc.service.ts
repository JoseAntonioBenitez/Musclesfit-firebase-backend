import { Injectable } from '@angular/core';
import { DocumentData } from '@firebase/firestore';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { diaryWorkout } from '../model/diaryWorkout';
import { FirebaseService } from './firebase/firebase-service';

@Injectable({
  providedIn: 'root'
})
export class DiarySvcService {
  private _moment:any = moment;

  private _diarySubject:BehaviorSubject<diaryWorkout[]> = new BehaviorSubject([]);
  public diaryList$ = this._diarySubject.asObservable();

  unsbscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsbscr = this.firebase.subscribeToCollection('diary',this._diarySubject, this.mapDiary);
   }


   ngOnDestroy(): void {
    this.unsbscr();
  }

   private mapDiary(doc:DocumentData){
    return{
      id:0,
      docId:doc['id'],
      idWorkout:doc['data']().idWorkout,
      dateWorkout:doc['data']().dateWorkout,
      weight:doc['data']().weight,
      reps:doc['data']().reps
    };
  }
  

  async deleteDiaryListById(diary:diaryWorkout){
    await this.firebase.deleteDocument('diary',diary.docId)
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

  async addDiaryList(diary:diaryWorkout){
   var _diary = {
    id:0,
    docId:diary.docId,
    idWorkout:diary.idWorkout,
    dateWorkout:diary.dateWorkout,
    weight:diary.weight,
    reps:diary.reps

   }
   try {
    await this.firebase.createDocument('diary',_diary);
  }catch(error){
    console.log(error)
  }
  }

  async updateDiaryList(diary:diaryWorkout){
    var _diary = {
      id:0,
      docId:diary.docId,
      idWorkout:diary.idWorkout,
      dateWorkout:diary.dateWorkout,
      weight:diary.weight,
      reps:diary.reps
  
     }
     try {
      await this.firebase.updateDocument('diary',diary.docId,_diary);
    }catch(error){
      console.log(error)
    }
  }

  getDiaryByIdWorkout(id:string){
    return new Promise<diaryWorkout>(async (resolve,reject) => {
      try{
        var diary = (await this.firebase.getDocument('diary',id));
        resolve({
          id:0,
          docId:diary.id,
          idWorkout:diary.data['idWorkout'],
          dateWorkout:diary.data['dateWorkout'],
          weight:diary.data['weight'],
          reps:diary.data['reps']

        });
      }catch(error){
        reject(error);
      }
    });
  }

  //METER FILTRADO POR USUARIOS 
  

}
