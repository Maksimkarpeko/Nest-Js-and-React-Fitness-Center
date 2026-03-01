import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service.js";

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy,"local_user"){
  constructor(private authService:AuthService){
    super({
      usernameField:"login"
    });
  }

  async validate(login:string,password:string) {
    const user = await this.authService.validateUser(login,password);
    return user;
  }

}