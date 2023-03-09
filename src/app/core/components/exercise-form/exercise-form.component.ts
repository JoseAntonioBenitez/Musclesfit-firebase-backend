import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Workout } from '../../model/workout';
import { PhotoItem, PhotoService } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.scss'],
})
export class ExerciseFormComponent implements OnInit {

  form:FormGroup ;
  mode: "New" | "Edit" = "New"; 

  currentImage = new BehaviorSubject<string>("");
  currentImage$ = this.currentImage.asObservable();

  @Input('workout') set workout(workout:Workout){
    if(workout){
      this.form.controls['id'].setValue(workout.id);
      this.form.controls['docId'].setValue(workout.docId);
      this.form.controls['name'].setValue(workout.name);
      this.form.controls['id_equipment'].setValue(workout.id_equipment);
      this.form.controls['id_category'].setValue(workout.id_category);
      this.form.controls['image'].setValue(workout.image);
      if(workout.image)
        this.currentImage.next(workout.image);
      this.mode = "Edit";
      
    }

  }
  constructor(public platform:PlatformService,
    private formBuilder:FormBuilder, 
    private modal:ModalController,
    private photoSvc:PhotoService,
    private cdr: ChangeDetectorRef
    ) {

     
    this.form = this.formBuilder.group({
      id:[null],
      docId:[''],
      name:['',[Validators.required]],
      id_equipment:['',[Validators.required]],
      id_category:['',[Validators.required]],
      image:[''],
      pictureFile:[null]
    });
  }

  ngOnInit() {}

  onSubmit(){
    this.modal.dismiss({workout: this.form.value, mode: this.mode}, 'ok')
  }

  onDismiss(){
    this.modal.dismiss(null,'cancel');
  }

  async changePic(fileLoader:HTMLInputElement, mode:'library' | 'camera' | 'file'){
    var item:PhotoItem = await this.photoSvc.getPicture(mode, fileLoader);
    this.currentImage.next(item.base64);
    this.cdr.detectChanges();
    this.form.controls['pictureFile'].setValue(item.blob);
  }
}
