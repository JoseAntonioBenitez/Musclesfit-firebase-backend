import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Equipment } from '../../model/equipment';

@Component({
  selector: 'app-equipment-item',
  templateUrl: './equipment-item.component.html',
  styleUrls: ['./equipment-item.component.scss'],
})
export class EquipmentItemComponent implements OnInit {
  @Output() onUpdate = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  private _equipment:Equipment;
  @Input('equipment') set equipment(eq){
    this._equipment = eq;
  }

  public get equipment(){
    return this._equipment;
  }
  constructor() { }

  ngOnInit() {}
  
  onUpdateClick(){
    console.log(this.equipment.docId)
    this.onUpdate.emit(this.equipment);
  }

  onDeleteClick(){
    this.onDelete.emit(this.equipment);
  }

}
