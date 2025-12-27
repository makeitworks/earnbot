import { Exclude, Expose } from "class-transformer";


@Exclude()
export class UserResponseDto {
  @Expose()
  uid: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  avatar: string;
  
  @Expose()
  createTime: Date;
}