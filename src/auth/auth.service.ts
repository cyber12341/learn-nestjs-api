import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  // login() {}

  // signUp() {}

  signUp() {
    return {
      msg: "I'm signing up!",
    };
  }

  signIn() {
    return {
      msg: "I'm signing in!",
    };
  }
}
