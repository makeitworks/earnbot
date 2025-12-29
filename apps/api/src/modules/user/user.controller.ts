import { Controller, Get, Logger, NotFoundException, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@Req() request: Request) {

        const user = await this.userService.findByEmail(request['user'].email);
        if(!user) {
            throw new NotFoundException()
        }

        return {
            user: plainToInstance(UserResponseDto, user)
        }
    }
}
