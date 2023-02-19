import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PasswordValidation } from 'src/app/core/utils/password-validator';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
})
export class SingupComponent implements OnInit {
  
  form:FormGroup
  constructor(
    private formBuilder:FormBuilder,
    private modalController:ModalController
  ) { 
    this.form = this.formBuilder.group({
      first_name:["",Validators.required],
      last_name:["",Validators.required],
      email:["",[Validators.required, Validators.email]],
      password:["",Validators.required],
      confirm_password:["",Validators.required]
    },{validator:[PasswordValidation.passwordMatch, PasswordValidation.passwordProto]});
  }

  ngOnInit() {}

  register(){
    this.modalController.dismiss({
      email:this.form.value.email,
      username:this.form.value.email,
      password:this.form.value.password,
      first_name:this.form.value.first_name,
      last_name:this.form.value.last_name
    }, 'ok');
  }

}
