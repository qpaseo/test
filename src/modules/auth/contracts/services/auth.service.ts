import { TokenPayload } from "../../../../common/utils/contracts/token.manager.util";
import { UserInfoResponse } from "../../../user/types/dto/response/user-info.response";
import { LoginResponse } from "../../types/dto/response/login.response";
import { SignUpResponse } from "../../types/dto/response/sign-up.response";
import { LoginRequest, SignUpRequest } from "../../validators/auth.validator";

export interface IAuthService {
  signUp(input: SignUpRequest): Promise<SignUpResponse>;
  login(input: LoginRequest): Promise<LoginResponse>;
  getUserInfoFromToken(tokenPayload: TokenPayload): Promise<UserInfoResponse>;
}
