import { Injectable } from '@angular/core';
import { DocumentData } from '@firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { CategoryWorkout } from '../model/categoryWorkout';
import { Equipment } from '../model/equipment';
import { Workout } from '../model/workout';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';


@Injectable({
  providedIn: 'root'
})
export class WorkoutSVCService {

  
  private _workoutSubjetc:BehaviorSubject<Workout[]> = new BehaviorSubject([]);
  public workout$ = this._workoutSubjetc.asObservable();

  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
      this.unsubscr = this.firebase.subscribeToCollection('workout',this._workoutSubjetc, this.mapWorkout)
    }

  private mapWorkout(doc:DocumentData){
    return{
      id:0,
      docId:doc['id'],
      name:doc['data']().name,
      id_equipment:doc['data']().id_equipment,
      id_category:doc['data']().id_category,
      image:doc['data']().image
    };
  }

  getWorkoutByCategory(id:string){ //Filter by Category
    return new Promise<CategoryWorkout>(async (resolve,reject) => {
      try{
        var category = (await this.firebase.getDocument('category',id));
        resolve({
          id:0,
          docId:category.id,
          nameCategory:category.data['nameCategory'],
          image:category.data['image']

        });
      }catch(error){
        reject(error);
      }
    });
  }

  getWorkoutById(id:string){
    return new Promise<Workout>(async (resolve,reject) => {
      try{
        var workout = (await this.firebase.getDocument('workout',id));
        resolve({
          id:0,
          docId:workout.id,
          name:workout.data['nameCategory'],
          id_equipment:workout.data['id_equipment'],
          id_category:workout.data['id_category'],
          image:workout.data['image']

        });
      }catch(error){
        reject(error);
      }
    });
  }

  getWorkoutByEquipment(id:string){
    return new Promise<Equipment>(async (resolve, reject) => {

      try{
        var equipment = (await this.firebase.getDocument('equipment',id));
        resolve({
          id:0,
          docId:equipment.id,
          name_equipment:equipment.data['name_equipment'],
          image:equipment.data['image']

        });
      }catch(error){
        reject(error);
      }
      
    });
  }

  async deleteWorkout(workout:Workout){
    await this.firebase.deleteDocument('workout',workout.docId);
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

  async addWorkout(workout:Workout){
    console.log("workout id equipment:"+workout.id_equipment);
    console.log("workout id category:"+workout.id_category);
    var _workout = {
      id:0,
      docId:workout.docId,
      name:workout.name,
      id_equipment:workout.id_equipment,
      id_category:workout.id_category
    };
    if(workout['pictureFile']){
      var response:FileUploaded = await this.uploadImage(workout['pictureFile']);
      _workout['image'] = response.file;
    }
    try {
      await this.firebase.createDocument('workout',_workout);
    }catch(error){
      console.log(error)
    }
  }

  async updateWorkout(workout:Workout){
    var _workout = {
      id:0,
      docId:workout.docId,
      name:workout.name,
      id_equipment:workout.id_equipment,
      id_category:workout.id_category
    };
    if(workout['pictureFile']){
      var response:FileUploaded = await this.uploadImage(workout['pictureFile']);
      _workout['image'] = response.file;
    }
    try {
      await this.firebase.updateDocument('workout',workout.docId, _workout);
    }catch(error){
      console.log(error)
    }
  }
}
