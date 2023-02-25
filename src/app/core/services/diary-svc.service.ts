import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { diaryWorkout } from '../model/diaryWorkout';

@Injectable({
  providedIn: 'root'
})
export class DiarySvcService {
  private moment:any = moment;
  private _diaryList: diaryWorkout[] = [

  ];

  private diarySubject:BehaviorSubject<diaryWorkout[]> = new BehaviorSubject(this._diaryList);
  public diaryList$ = this.diarySubject.asObservable();

  id:number = (this._diaryList.length)+1;

  constructor() { }

  deleteDiaryListById(id:number){
    this._diaryList = this._diaryList.filter(d=>d.id != id); 
    this.diarySubject.next(this._diaryList); 
  }

  addDiaryList(diary:diaryWorkout){
    diary.id = this.id++
    this._diaryList.push(diary);
  }

  updateDiaryList(diaryItem:diaryWorkout){
    console.log(diaryItem)
    var _diary = this._diaryList.find(diary=>diary.id == diaryItem.id);
    if (_diary){
      _diary.idWorkout = diaryItem.idWorkout
      _diary.dateWorkout = diaryItem.dateWorkout
      _diary.weight = diaryItem.weight
      _diary.reps = diaryItem.reps
    }
  }

  getDiaryByIdWorkout(id:number){
    return this._diaryList.find(w => w.idWorkout == id);
  }

}
