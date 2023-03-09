import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CategoryWorkout } from '../../model/categoryWorkout';
import { PhotoItem, PhotoService } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {

  form:FormGroup;
  mode: "New" | "Edit" = "New"; 

  currentImage = new BehaviorSubject<string>("");
  currentImage$ = this.currentImage.asObservable();
  
  @Input('category') set category(category:CategoryWorkout){
    if(category){
      this.form.controls['id'].setValue(category.id);
      this.form.controls['docId'].setValue(category.docId);
      this.form.controls['nameCategory'].setValue(category.nameCategory);
      this.form.controls['image'].setValue(category.image);
      if(category.image)
        this.currentImage.next(category.image);
      this.mode = "Edit";
      
    }

  }
  constructor(
      public platform:PlatformService,
      private formBuilder:FormBuilder, 
      private modal:ModalController,
      private photoSvc:PhotoService,
      private cdr: ChangeDetectorRef
    ) {
    this.form = this.formBuilder.group({
      id:[null],
      docId:[''],
      nameCategory:['',[Validators.required]],
      image:[''],
      pictureFile:[null]
    });
  }

  ngOnInit() {}

  onSubmit(){
    this.modal.dismiss({category: this.form.value, mode: this.mode}, 'ok')
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
