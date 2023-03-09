import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { diaryWorkout } from '../../model/diaryWorkout';
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
  @Input() diary:diaryWorkout;
  constructor(

    private workoutSVC:WorkoutSVCService,
    private categorySVC:CategoryWorkoutSVCService,
    private screenSizeSVC:ScreenSizeSVCService

  ) { 
    if (this.diary) {
      console.log(this.diary.docId)
    } else {
      console.log('La variable diary es undefined');
    }
  }

    
  async getWorkoutNameById(id:string | undefined){
    if(id!=null){

      try{
        var result = (await this.workoutSVC.getWorkoutById(id))?.name;
      }catch(error){
        console.log(error);
      }
      return result;
    }
    return{}
    
  }
  async getWorkoutImageById(id:string | undefined){
    if(id!=null){
      try{
        var result = (await this.workoutSVC.getWorkoutById(id))?.image;
      }catch(error){
        console.log(error);
      }
      return result;
    }
    return{}
    
  }

  async getCategoryById(id:string | undefined){
    if(id!=null){
      try{
        var idCategoria = (await this.workoutSVC.getWorkoutById(id))?.id_category;
        var result = (await this.categorySVC.getCategoryById(idCategoria!))?.nameCategory;

      }catch(error){
        console.log(error);
      }
      return result;
    }
    return{}
    
  }

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
