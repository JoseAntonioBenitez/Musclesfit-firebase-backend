import { Injectable } from '@angular/core';
import { DocumentData } from '@firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { CategoryWorkout } from '../model/categoryWorkout';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryWorkoutSVCService {
  private _categorySubjetc:BehaviorSubject<CategoryWorkout[]> = new BehaviorSubject([]);
  public category$ = this._categorySubjetc.asObservable();

  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) { this.unsubscr = this.firebase.subscribeToCollection('category',this._categorySubjetc,this.mapCategory)}

  private mapCategory(doc:DocumentData){
    return{
      id:0,
      docId:doc['id'],
      nameCategory:doc['data']().nameCategory,
      image:doc['data']().image
    };
  }

  getCategoryById(id:string):Promise<CategoryWorkout>{
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

  async deleteCategorytById(category:CategoryWorkout){
    await this.firebase.deleteDocument('category',category.docId)
  }

  async addCategory(category:CategoryWorkout){
    var _category = {
      id:0,
      docId:category.docId,
      nameCategory:category.nameCategory
    };
    if(category['pictureFile']){
      var response:FileUploaded = await this.uploadImage(category['pictureFile']);
      _category['image'] = response.file;
    }
    try {
      await this.firebase.createDocument('category',_category);
    }catch(error){
      console.log(error)
    }
  }

  async updateCategory(category:CategoryWorkout){
    var _category = {
      id:0,
      docId:category.docId,
      nameCategory:category.nameCategory
    };
    if(category['pictureFile']){
      var response:FileUploaded = await this.uploadImage(category['pictureFile']);
      _category['image'] = response.file;
    }
    try {
      await this.firebase.updateDocument('category',category.docId, _category);
    }catch(error){
      console.log(error);
    }
  }

}
