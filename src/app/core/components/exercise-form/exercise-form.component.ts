import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Workout } from '../../model/workout';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {

  form:FormGroup ;
  mode: "New" | "Edit" = "New"; 

  @Input('workout') set workout(workout:Workout){
    if(workout){
      this.form.controls['id'].setValue(workout.id);
      this.form.controls['name'].setValue(workout.name);
      this.form.controls['id_equipment'].setValue(workout.id_equipment);
      this.form.controls['id_category'].setValue(workout.id_category);
      this.form.controls['image'].setValue(workout.image);
      this.mode = "Edit";
      
    }

  }
  constructor(private formBuilder:FormBuilder, 
              private modal:ModalController
    ) {
    this.form = this.formBuilder.group({
      id:[null],
      name:['',[Validators.required]],
      id_equipment:['',[Validators.required]],
      id_category:['',[Validators.required]],
      image:['']
    });
  }

  ngOnInit() {}

  onSubmit(){
    this.modal.dismiss({workout: this.form.value, mode: this.mode}, 'ok')
  }

  onDismiss(){
    this.modal.dismiss(null,'cancel');
  }

}
