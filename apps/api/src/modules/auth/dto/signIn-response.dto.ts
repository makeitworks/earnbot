import { UserResponseDto } from "../../user/dto/user-response.dto";


export class SignInResponseDto {
  accessToken: string;
  user: UserResponseDto;
}