import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(signInDto: SignInDto): Promise<any> {
        const user = await this.userService.findOne(signInDto.email);
        if (user?.password !== signInDto.password) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.userId, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: plainToInstance(UserResponseDto, user),
        }

    }

    async signUp(signUpDto: SignUpDto): Promise<any> {

        return true
    }
}
