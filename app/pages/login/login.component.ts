import { setHintColor } from "../../utils/hint-util";
import { TextField } from "ui/text-field";
import { Page } from "ui/page";
import { Color } from "color";
import { View } from "ui/core/view";
import { User } from "../../shared/user/user";
import { UserService } from "../../shared/user/user.service"
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "my-app",
  providers: [UserService],
  templateUrl: "pages/login/login.html",
  styleUrls: ["pages/login/login-common.css", "pages/login/login.css"]
})
export class LoginComponent implements OnInit {
  user: User;
  isLoggingIn = true;
  @ViewChild("container") container: ElementRef;
  @ViewChild("email") email: ElementRef;
  @ViewChild("password") password: ElementRef;

  constructor(private router: Router,
    private UserService: UserService,
    private page: Page) {
    this.user = new User();
    this.user.email = "sly@fly.de";
    this.user.password = "hola";
  }

  submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
      return;
    }
    console.log("hi, I got " + this.user.email);
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }
  login() {
    this.UserService.login(this.user)
      .subscribe(
      () => this.router.navigate(["/list"]),
      (error) => alert("Unfortunately we couldn't find your account.")
      );
  }
  signUp() {
    this.UserService.register(this.user)
      .subscribe(
      () => {
        alert("Your account was successfully created.");
        this.toggleDisplay();
      },
      () => alert("Unfortunately we were unable to create your account.")
      );
  }
  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
    this.setTextFieldColors();

    let container = <View>this.container.nativeElement;
    container.animate({
      backgroundColor: this.isLoggingIn ? new Color("white") : new Color("#301217"),
      duration: 200
    })
  }
  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundImage = "res://bg_login";
  }
  setTextFieldColors() {
    let emailTextField = <TextField>this.email.nativeElement;
    let passwordTextField = <TextField>this.password.nativeElement;

    let mainTextColor = new Color(this.isLoggingIn ? "black" : "#C4AFB4");
    emailTextField.color = mainTextColor;
    passwordTextField.color = mainTextColor;

    let hintColor = new Color(this.isLoggingIn ? "#ACA6A7" : "#C4AFB4");
    setHintColor({ view: emailTextField, color: hintColor });
    setHintColor({ view: passwordTextField, color: hintColor });
  }
}
