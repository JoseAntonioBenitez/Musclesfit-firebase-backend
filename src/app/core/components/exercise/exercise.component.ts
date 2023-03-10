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


  private _workout:Workout;

  @Input('workout') set workout(w:Workout){
    this._workout = w;
  }

  get workout():Workout{
    return this._workout;
  }

  private _equipment:Equipment;
  @Input('equipment') set equipment(e:Equipment){
    this._equipment = e;

  }

  get equipment():Equipment{
    return this._equipment;
  }

  private _category:CategoryWorkout;
  @Input('category') set category(c:CategoryWorkout){
    this._category = c;

  }

  get category():CategoryWorkout{
    return this._category;
  }

  @Output() onUpdate = new EventEmitter<Workout>();
  @Output() onDelete = new EventEmitter<Workout>();



  constructor(
  ) { 

  }
  ngOnInit() {
    
  }


  onUpdateClick(){
    this.onUpdate.emit(this.workout);
  }

  onDeleteClick(){
    this.onDelete.emit(this.workout);
  }
    
}
