import { UserResponseDto } from "../../user/dto/user-response.dto";


export class SignInResponseDto {
  token: string;
  user: UserResponseDto;
}