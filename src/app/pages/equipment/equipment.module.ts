import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentPageRoutingModule } from './equipment-routing.module';

import { EquipmentPage } from './equipment.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/core/utils/translate';
import { HttpClient } from '@angular/common/http';
import { CoreModule } from 'src/app/core/core.module';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

@NgModule({
  imports: [
    CoreModule,
    TranslateModule.forChild({
      loader:{ 
        provide:TranslateLoader,
        useFactory:(createTranslateLoader),
        deps:[HttpClient]  
      }
    }),
    EquipmentPageRoutingModule,
  ],
  declarations: [EquipmentPage],
  providers:[
    Camera,
    File]
})
export class EquipmentPageModule {}
