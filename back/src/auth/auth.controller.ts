import { RefreshTokenDto } from './dto/refreshToken.dto'
import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'

@Controller('auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}
	// LOGIN
	@UsePipes(new ValidationPipe())
	@HttpCode(200) // Ставим везде где Put или Post
	@Post('login')
	async login(@Body() dto: AuthDto) {
		return this.AuthService.login(dto)
	}
	// ПОЛУЧЕНИЕ НОВОГО ТОКЕНА
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Body() dto: RefreshTokenDto) {
		return this.AuthService.getNewTokens(dto)
	}
	// REGISTER
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto) {
		return this.AuthService.register(dto)
	}
}
