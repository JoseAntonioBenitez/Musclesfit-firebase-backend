import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryWorkout } from '../../model/categoryWorkout';
import { Equipment } from '../../model/equipment';
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


  private _equipment:BehaviorSubject<Equipment> = new BehaviorSubject<Equipment>(null);
  private _category:BehaviorSubject<CategoryWorkout> = new BehaviorSubject<CategoryWorkout>(null);
  equipment$:Observable<Equipment> = this._equipment.asObservable();
  category$:Observable<CategoryWorkout> = this._category.asObservable();

  constructor(
    private equipmentSVC : EquipamentSVCService,
    private categorySVC : CategoryWorkoutSVCService
  ) { 

    this.loadEquipmetsAndCategories();
  }
  ngOnInit() {
    
  }

  async loadEquipmetsAndCategories() {
    this._equipment.next(await this.equipmentSVC.getEquipmentById(this.workout.id_equipment));
    this._category.next(await this.categorySVC.getCategoryById(this.workout.id_category));
  }


  onUpdateClick(){
    this.onUpdate.emit(this.workout);
  }

  onDeleteClick(){
    this.onDelete.emit(this.workout);
  }
    
}
