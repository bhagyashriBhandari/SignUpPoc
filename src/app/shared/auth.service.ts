import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Router } from '@angular/router';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from '@angular/fire/auth'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private fireauth : AngularFireAuth, private router : Router) { }

  // login method
  login(email : string, password : string){
    this.fireauth.signInWithEmailAndPassword(email,password).then((res : any)=>{
      localStorage.setItem('token', 'true');
      this.router.navigate(['dashboard']);
      
    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    })
  }

  // register method
  register(email : string, password :  string){
    this.fireauth.createUserWithEmailAndPassword(email,password).then((res : any)=>{
      alert("registration successful");
      this.router.navigate(['/login']);
      this.sendEmailForVerification(res.user);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register'])
    })
  }

  // logout
  logout(){
    this.fireauth.signOut().then(()=>{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err =>{
       alert(err.message)
    })
  }

  // forgot password
  forgotPassword(email:string){
    this.fireauth.sendPasswordResetEmail(email).then(()=>{
      this.router.navigate(['/verify-email'])
    }, err =>{
      alert("something went wrong");
    })
  }

  // email verification
  sendEmailForVerification(user:any){
    user.sendEmailForVerification().then((res:any)=>{
      this.router.navigate(['/verify-email']);
    }, (err:any) =>{
      alert("something went wrong!!! Not able to send mail to ypur email...")
    })
  }

  //google sign in
  googleSignIn(){
    return this.fireauth.signInWithPopup(new GoogleAuthProvider).then((res :  any )=>{
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid))
    }, (err:any)=>{
      alert(err.message);
    })
  }
}
