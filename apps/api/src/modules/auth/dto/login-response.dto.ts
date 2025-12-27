import { UserResponseDto } from "../../user/dto/user-response.dto";


export class LoginResponseDto {
  accessToken: string;
  user: UserResponseDto;
}