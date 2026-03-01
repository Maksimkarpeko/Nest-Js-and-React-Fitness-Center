import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service.js";

@Injectable()
export class LocalTrainerStrategy extends PassportStrategy(Strategy,'local_trainer'){
  constructor(private authService:AuthService){
    super({
      usernameField:"login"
    });
  }

  async validate(login:string,password:string) {
    const trainer = await this.authService.validateTrainer(login,password);
    return trainer;
  }

}