import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { idValidationPipe } from 'src/pipes/id.validation.pipe'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	// @Auth('admin')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile') // обновление юзера
	@HttpCode(200) //Ставим 200 везде где Put или Post
	@Auth() // Должен быть авторизован
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id') // :id query param вытаскивается через декоратор @Param
	@HttpCode(200)
	@Auth('admin') // Должен быть имено admin
	async updateUser(
		@Param('id', idValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}
}

// 14:30
