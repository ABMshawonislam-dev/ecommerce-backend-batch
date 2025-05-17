import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    async register (registerDto: RegisterDto){
        const {email, password,firstName,lastName,role,username} = registerDto;

        const exitingUser = await this.usersRepository.findOne({where: {email}});

        if(exitingUser){
            throw new UnauthorizedException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            role: role,
            username: username,
            refreshToken: uuidv4()
        })

        console.log(user)

        await this.usersRepository.save(user);

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        }

        return{
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {expiresIn: '7d'}),
            user:{
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                username: user.username
            }
           
        }

    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
             throw new UnauthorizedException('Invalid credentials');
        }

       const newRefreshToken = uuidv4(); // Generate a new refresh token
        await this.usersRepository.update(user.id, { refreshToken: newRefreshToken });
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        }

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: newRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                username: user.username
            }
        };


    }


    async refresh(refreshToken: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { refreshToken } });
    if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
    }

    const newRefreshToken = uuidv4(); // Generate a new refresh token
    await this.usersRepository.update(user.id, { refreshToken: newRefreshToken });

    const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
    }

    return {
        access_token: this.jwtService.sign(payload),
        refresh_token: newRefreshToken,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            username: user.username
        }
    };

}

}


