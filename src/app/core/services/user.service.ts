import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User, UserLogin, UserRegister } from '../model/user';
import { FirebaseService } from './firebase/firebase-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _isLogged = new BehaviorSubject<boolean>(false);
  public isLogged$ = this._isLogged.asObservable();
  private _user = new BehaviorSubject<User>(null);
  public user$ = this._user.asObservable();

  constructor(
    private firebase: FirebaseService,
    private router: Router
  ) { 
    this.init()
  }

  private async init(){
    this.firebase.isLogged$.subscribe(async (logged)=>{
      if(logged){
        try{
          this._user.next((await this.firebase.getDocument('usuarios', this.firebase.getUser().uid)).data as User);
          this.navigateToHome();
        }
        catch(error){
          console.log(error);
        }
      }
      this._isLogged.next(logged);
    });
    
  }


  //me deveulve el usuario autorizado.
  public getAuthUser(){
    
    console.log(this._isLogged.getValue);
  }
  private navigateToHome() {
    try {
      this.router.navigate(['home']);
    } catch (error) {
      console.log(error);
    }
  }

  public async login(dataUsers: UserLogin){
    try {
      if (!this._isLogged.value) {
        await this.firebase.connectUserWithEmailAndPassword(dataUsers.identifier, dataUsers.password);
      } else {
        throw new Error('Already connected');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public signOut() {
    this.firebase.signOut();
    this.router.navigate(['login']);
  }
  
  public async register(data: UserRegister){
    try {
      if (!this._isLogged.value) {
        const user = await this.firebase.createUserWithEmailAndPassword(data.email, data.password);
        const userData = {
          uid: user.user.uid,
          username: data.username, 
          nickname: "",
          picture: "",
          email: data.email,
          provider: "firebase",
          token: await user.user.getIdToken(),
          first_name: data.first_name, 
          last_name: data.last_name
        };
        await this.firebase.createDocumentWithId('usuarios', userData, user.user.uid);
        await this.firebase.connectUserWithEmailAndPassword(data.email, data.password);
      } else {
        throw new Error('Already connected');
      } 
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

