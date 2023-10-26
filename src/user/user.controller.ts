import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    
    @UseGuards(
        JwtGuard
    )
    @Get('/me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @Patch('/me')
    editUser(@Req() req: Express.Request) {
        return req.user;
    }
    
}