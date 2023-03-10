import { Component } from '@angular/core';
import { async } from '@firebase/util';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { DiaryFormComponent } from 'src/app/core/components/diary-form/diary-form.component';
import { diaryWorkout } from 'src/app/core/model/diaryWorkout';
import { Workout } from 'src/app/core/model/workout';
import { DiarySvcService } from 'src/app/core/services/diary-svc.service';
import { ScreenSizeSVCService } from 'src/app/core/services/screen-size-svc.service';
import { UserService } from 'src/app/core/services/user.service';
import { WorkoutSVCService } from 'src/app/core/services/workout-svc.service';


export interface diaryWrapper{
  diary:diaryWorkout,
  workout:Workout
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private _diaries:BehaviorSubject<diaryWrapper[]> = new BehaviorSubject<diaryWrapper[]>([]);
  public diaries$ = this._diaries.asObservable();

  ScreenSizeWidth:number = this.ScreenSizeSVC.getScreenSizeWidth();

  //Size Plataforms
  PhoneWidth:number = 500;
  TabletWidth:number = 600;
  MonitorWidth:number = 1000;
  
  constructor(
    private ScreenSizeSVC:ScreenSizeSVCService,    
    private DiarySVC:DiarySvcService,
    private workoutSVC:WorkoutSVCService,
    private modal:ModalController,
    private alert:AlertController,
    private translate:TranslateService,
    private userSVC:UserService
  ){
    this.DiarySVC.diaryList$.subscribe(async diaries => {

      var _diaries:diaryWrapper[] = await Promise.all(diaries.map ( async diary =>{
        console.log(await this.workoutSVC.getWorkoutById(diary.idWorkout));
          return {
              diary:diary,
              
              workout: await this.workoutSVC.getWorkoutById(diary.idWorkout)
          }
      }));
      this._diaries.next(_diaries);
    });
  }


  getDiaryList(){
    return this.DiarySVC.diaryList$
  }  

  getScreenSize(){
    this.ScreenSizeWidth = this.ScreenSizeSVC.getScreenSizeWidth()
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

   async DiaryListForm (diary:diaryWorkout|null|undefined){
    const modal = await this.modal.create({
        component:DiaryFormComponent,
        componentProps:{
          diary:diary
        },
        cssClass:"modal-full-right-side"
    });
    modal.present();
      modal.onDidDismiss().then(result=>{
        if(result && result.data){
          switch(result.data.mode){
            case 'New':
              this.DiarySVC.addDiaryList(result.data.diary);
              break;
            case 'Edit':
              this.DiarySVC.updateDiaryList(result.data.diary);
              break;
            default:
          }
        }
      });
  }

  onAddDiaryList(){
    this.DiaryListForm(null);
  }
  
  onUpdateDiaryList(diary:diaryWorkout){
    this.DiaryListForm(diary);
  } 

async onDeleteAlert(diary:any){
  const alert = await this.alert.create({
    header: await lastValueFrom(this.translate.get('general.warning')),
    buttons: [
      {
        text: await lastValueFrom(this.translate.get('general.btn_cancel')),
        role: 'cancel',
        handler: () => {
          console.log("Operacion cancelada");
        },
      },
      {
        text: await lastValueFrom(this.translate.get('general.btn_delete')),
        role: 'confirm',
        handler: () => {
            this.DiarySVC.deleteDiaryListById(diary);
          
        },
      },
    ],
  });

  await alert.present();
  const { role } = await alert.onDidDismiss();

}

  onDeleteDiaryList(diary:diaryWorkout){
    this.onDeleteAlert(diary);
  }


  signOut(){
    this.userSVC.signOut();
  }
}
