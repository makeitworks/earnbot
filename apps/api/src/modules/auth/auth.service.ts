import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(loginDto: LoginDto): Promise<any> {
        const user = await this.userService.findOne(loginDto.email);
        if (user?.password !== loginDto.password) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.userId, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: plainToInstance(UserResponseDto, user),
        }

    }

    async register(registerDto: Record<string, any>): Promise<any> {

        return true
    }
}
