import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Equipment } from '../../model/equipment';
import { PhotoItem, PhotoService } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.scss']
})
export class EquipmentFormComponent implements OnInit {


  form:FormGroup;
  mode: "New" | "Edit" = "New"; 

  currentImage = new BehaviorSubject<string>("");
  currentImage$ = this.currentImage.asObservable();

  
  @Input('equipament') set equipament(equipament:Equipment){
    if(equipament){
      this.form.controls['id'].setValue(equipament.id);
      this.form.controls['docId'].setValue(equipament.docId);
      this.form.controls['name_equipment'].setValue(equipament.name_equipment);
      this.form.controls['image'].setValue(equipament.image);
      if(equipament.image)
        this.currentImage.next(equipament.image);
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
      name_equipment:['',[Validators.required]],
      image:[''],
      pictureFile:[null]
    });
  }

  ngOnInit() {}

  onSubmit(){
    this.modal.dismiss({equipament: this.form.value, mode: this.mode}, 'ok')
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
