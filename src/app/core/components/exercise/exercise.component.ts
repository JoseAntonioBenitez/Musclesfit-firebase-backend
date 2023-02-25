import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Workout } from '../../model/workout';
import { CategoryWorkoutSVCService } from '../../services/category-workout-svc.service';
import { EquipamentSVCService } from '../../services/equipament-svc.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {


  @Input() workout!:Workout;
  @Output() onUpdate = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  constructor(
    private equipmentSVC : EquipamentSVCService,
    private categorySVC : CategoryWorkoutSVCService
  ) { }

  ngOnInit() {
    console.log(this.workout);
  }

  async getEquipmentById(id:string|undefined){
    if(id!=null)
      return (await this.equipmentSVC.getEquipmentById(id));
    return {};

  }

  
  async getCategoryById(id:string| undefined){
    if(id!=null)
      return (await this.categorySVC.getCategoryById(id));
    return {};
  }

  onUpdateClick(){
    this.onUpdate.emit(this.workout);
  }

  onDeleteClick(){
    this.onDelete.emit(this.workout);
  }
    
}
