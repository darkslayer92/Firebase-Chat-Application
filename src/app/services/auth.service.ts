import { User } from './../models/user.model';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { resolve } from 'path';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private user: Observable<firebase.User>;
  private authState: any;
  
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
    this.user = afAuth.authState;
  }

  authUser() { 
    return this.user;
  }
  
  currentUserId(): string { 
    return this.authState !== null ? this.authState.user.uid  : '';
  }

  login(email: string, password: string) { 
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(resolve => { 
        const status = 'online';
        this.setUserStatus(status);
        this.router.navigate(['chat']);
      })
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => { 
        this.authState = user;
        const status = 'online';
        this.setUserData(email, displayName, status);
      }).catch(error => console.log(error));
  }

  setUserData(email: string, displayName: string, status: string): void {
    const uid = this.currentUserId();
    const path = '/users/' + uid;
    const data = {
      email: email,
      displayName: displayName,
      status: status
    };

    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  setUserStatus(status: string) { 
    const path = 'users/${this.currentUserId}';
    const data = {
      status: status
    };
  }
}
