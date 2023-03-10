import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom, tap } from 'rxjs';
import { ExerciseFormComponent } from 'src/app/core/components/exercise-form/exercise-form.component';
import { CategoryWorkout } from 'src/app/core/model/categoryWorkout';
import { Equipment } from 'src/app/core/model/equipment';
import { Workout } from 'src/app/core/model/workout';
import { CategoryWorkoutSVCService } from 'src/app/core/services/category-workout-svc.service';
import { DiarySvcService } from 'src/app/core/services/diary-svc.service';
import { EquipamentSVCService } from 'src/app/core/services/equipament-svc.service';
import { WorkoutSVCService } from 'src/app/core/services/workout-svc.service';


export interface WorkoutWrapper{
  workout:Workout,
  equipment:Equipment,
  category:CategoryWorkout
}
@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {

  private _workouts:BehaviorSubject<WorkoutWrapper[]> = new BehaviorSubject<WorkoutWrapper[]>([]);
  public workouts$ = this._workouts.asObservable();
  constructor(
    private workoutSVC : WorkoutSVCService,
    private equipmentSVC : EquipamentSVCService,
    private categorySVC : CategoryWorkoutSVCService,
    private DiarySVC:DiarySvcService,
    private modal:ModalController,
    private alert:AlertController,
    private translate : TranslateService
  ) { 
    this.workoutSVC.workout$.subscribe(async workouts=>{

      var _workouts:WorkoutWrapper[] = await Promise.all( workouts.map( async workout=>{
        return {
          workout:workout,
          equipment:await this.equipmentSVC.getEquipmentById(workout.id_equipment),
          category:await this.categorySVC.getCategoryById(workout.id_category)
        }
      
      }));
      this._workouts.next(_workouts);
    });
  }

  ngOnInit() {
  }

  getWorkout(){
    return this.workoutSVC.workout$;
  }


  getWorkoutByCategory(id:string){
    return  this.workoutSVC.getWorkoutByCategory(id);
  }

  async getEquipmentId(id:string){
    return await this.equipmentSVC.getEquipmentById(id);
  }

  async workoutForm (exercise:Workout|null|undefined){
    const modal = await this.modal.create({
        component:ExerciseFormComponent,
        componentProps:{
          workout:exercise
        },
        cssClass:"modal-full-right-side"
    });
    modal.present();
      modal.onDidDismiss().then(result=>{
        if(result && result.data){
          switch(result.data.mode){
            case 'New':
              this.workoutSVC.addWorkout(result.data.workout);
              break;
            case 'Edit':
              this.workoutSVC.updateWorkout(result.data.workout);
              break;
            default:
          }
        }
      });
  }

  onAddWorkout(){
    this.workoutForm(null);
  }
  
  onUpdateWorkout(workout:Workout){
    this.workoutForm(workout);
  } 

async onDeleteAlert(workout:any){
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
            this.workoutSVC.deleteWorkout(workout);
          
        },
      },
    ],
  });

  await alert.present();
  const { role } = await alert.onDidDismiss();

}
async onWorkoutExistsAlert(workout:any){
  const alert = await this.alert.create({
    header: 'Error',
    message: await lastValueFrom(this.translate.get('general.exist')),
    buttons: [
      {
        text: await lastValueFrom(this.translate.get('general.btn_close')),
        role: 'close',
        handler: () => {
        },
      },
    ],
  });

  await alert.present();

  const { role } = await alert.onDidDismiss();
}

  async onDeleteWorkout(workout:any){
    this.DiarySVC.getDiaryByIdWorkout(workout.docId).then(diary=>{
      this.onWorkoutExistsAlert(workout);
    }).catch(error=>{
      this.onDeleteAlert(workout);
    });
  }
}
