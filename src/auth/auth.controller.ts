import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import {JwtAuthGuard} from '../jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auithentication')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    @Post('register')
    @ApiOperation({summary: 'Register a new user'})
    @ApiResponse({status: 201, description: 'User registered successfully'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 409, description: 'User already exists'})
    async register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto)
        // console.log(registerDto)
    }


    @Post('login')
    @ApiOperation({summary: 'Login a user'})
    @ApiResponse({status: 200, description: 'User logged in successfully'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Invalid credentials'})
    @ApiResponse({status: 404, description: 'User not found'})
    @ApiResponse({status: 409, description: 'User already exists'})
    async login(@Body() loginDto: LoginDto){
        console.log(loginDto)
        return this.authService.login(loginDto)
    }

    @Post('refresh')
    @ApiOperation({summary: 'Refresh access token'})
    @ApiResponse({status: 200, description: 'Access token refreshed successfully'})
    @ApiResponse({status: 400, description: 'Bad request'})
    @ApiResponse({status: 401, description: 'Invalid refresh token'})
    @ApiResponse({status: 404, description: 'User not found'})
    async refresh(@Body() refreshTokenDto: RefreshTokenDto){
        return this.authService.refresh(refreshTokenDto.refreshToken)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({summary: 'Get user profile'})
    @ApiResponse({status: 200, description: 'User profile retrieved successfully'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    async getProfile(){
        console.log("asdadsasd")

    }


}
