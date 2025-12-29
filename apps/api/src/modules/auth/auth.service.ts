import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signIn.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';


const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async signIn(signInDto: SignInDto) {
        const user = await this.userService.findByEmail(signInDto.email);
        if(!user) {
            throw new UnauthorizedException();
        }
        const ok = await bcrypt.compare(signInDto.password, user.password)
        if(!ok) {
            throw new UnauthorizedException();
        }

        const payload = { userId: user.uid, name: user.name, email: user.email };

        return {
            token: await this.jwtService.signAsync(payload),
            user: plainToInstance(UserResponseDto, user)
        }
    }

    async signUp(signUpDto: SignUpDto) {

        // hash password
        const hashedPassword = await bcrypt.hash(signUpDto.password, SALT_ROUNDS);

        const user = await this.userService.createUser(signUpDto.email, signUpDto.name, hashedPassword);

        if(!user) {
            throw new BadRequestException()
        }

        return {
            sucess: true,
            email: user.email,
            nextStep: 'login'
        }
    }
}
