import { Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonAccordionGroup } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Workout } from '../../model/workout';
import { WorkoutSVCService } from '../../services/workout-svc.service';


export const USER_PROFILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExerciseSelectableComponent),
  multi: true
};

@Component({
  selector: 'app-exercise-selectable',
  templateUrl: './exercise-selectable.component.html',
  styleUrls: ['./exercise-selectable.component.scss'],
  providers:[USER_PROFILE_VALUE_ACCESSOR]
  
})
export class ExerciseSelectableComponent implements OnInit {

  selectedExercise:Workout= null;
  propagateChange = ( _ : any) => { }
  isDisabled:boolean = false;

  constructor(
    private workoutSVC: WorkoutSVCService
  ) { }


  async writeValue(obj: any) {
    try{
      this.selectedExercise = await this.workoutSVC?.getWorkoutById(obj);
    }catch (error) {
      console.log("No se ha podido recupera los datos: "+error);
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit() {}

  getWorkout():Observable<Workout[]>{
    return this.workoutSVC.workout$;
  } 

  onWorkoutClicked(workout:Workout, accordion:IonAccordionGroup){
    
    this.selectedExercise = workout;
    accordion.value='';
    this.propagateChange(this.selectedExercise.docId);
  }
}
