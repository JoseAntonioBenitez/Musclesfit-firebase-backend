import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { diaryWorkout } from '../../model/diaryWorkout';
import { Workout } from '../../model/workout';
import { CategoryWorkoutSVCService } from '../../services/category-workout-svc.service';
import { ScreenSizeSVCService } from '../../services/screen-size-svc.service';
import { WorkoutSVCService } from '../../services/workout-svc.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
})
export class DiaryComponent implements OnInit {
 
  @Output() onUpdate = new EventEmitter;
  @Output() onDelete = new EventEmitter;



  private _diary:diaryWorkout;
  @Input('diary') set diary(d:diaryWorkout){
    this._diary = d;
  }

  
  get diary() : diaryWorkout {
    return this._diary;
  }
  

  private _workout:Workout;
  @Input('workout') set workout(w:Workout){
    this._workout = w;
  }

  get workout():Workout{
    return this._workout;
  }
  constructor(
    private screenSizeSVC:ScreenSizeSVCService

  ) {}

  //Size Plataforms
  PhoneWidth:number = 500;
  TabletWidth:number = 600;
  MonitorWidth:number = 1000;

  ScreenSizeWidth:number = this.screenSizeSVC.getScreenSizeWidth()

  getScreenSize(){
    this.ScreenSizeWidth = this.screenSizeSVC.getScreenSizeWidth()
   }

   screenType():'BIG'|'SMALL'{
      if (this.ScreenSizeWidth <= this.PhoneWidth){
        return 'SMALL'
      }else if (this.ScreenSizeWidth > this.TabletWidth && this.ScreenSizeWidth < this.MonitorWidth ){
        return 'BIG'
      }else{
        return 'BIG';
      }
   }

   onUpdateClick(){
    this.onUpdate.emit(this.diary);
  }

  onDeleteClick(){
    this.onDelete.emit(this.diary);
  }

  ngOnInit() {}

}
