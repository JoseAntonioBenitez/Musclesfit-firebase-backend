import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { CoreModule } from '../core/core.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../core/utils/translate';
import { HttpClient } from '@angular/common/http';
import { SigninComponent } from './components/signin/signin.component';
import { SingupComponent } from './components/singup/singup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoreModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
    LoginPageRoutingModule
  ],
  declarations: [LoginPage,SigninComponent,SingupComponent]
})
export class LoginPageModule {}
