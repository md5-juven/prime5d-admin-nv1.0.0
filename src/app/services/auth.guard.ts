import { CanActivateFn, Router } from '@angular/router';
import { TokenManageService } from './token-manage.service';
import { RouterServiceService } from './router-service.service';

let router: Router;

export const authGuard: CanActivateFn = (route, state) => {
  const token = getToken(new TokenManageService);
  if(token!=null){
    return true;
  }
  else{
    redirect();
    return false;
  }
};

function getToken(token: TokenManageService){
  return token.getToken();
}

function redirect(){
  router.navigate(['login']);
}
