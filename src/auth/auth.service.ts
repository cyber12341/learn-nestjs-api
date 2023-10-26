import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {
    
  }

  async signUp(dto: AuthDto) {
    try {
      //generate password hash
      const passwordHash = await argon.hash(dto.password);
      //save the user in the database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: passwordHash,
        },
      });
  
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
    }
  }

  async signIn(dto: AuthDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('Credential Incorrect');
    }
    //compare the password hash with the password
    const pwMatch = await argon.verify(user.hash, dto.password);

    //if the password is incorrect throw exception
    if (!pwMatch) {
      throw new ForbiddenException('Credential Incorrect');
    }
    
    delete user.hash;
    return user;
  }
}
