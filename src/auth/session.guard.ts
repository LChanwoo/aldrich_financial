import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class SessionGuard extends AuthGuard('session') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}