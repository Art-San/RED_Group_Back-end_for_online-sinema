import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
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
		// сам юзер обновляет данные
		return this.userService.updateProfile(_id, dto)
	}

	@Get('count') // 19:05
	@Auth('admin')
	async getCountUsers() {
		return this.userService.getCount()
	}

	// ПОЛУЧЕНИЕ ВСЕХ и ПОИСК по email и сортировка по дате АДМИНОМ
	@Get() // ?searchTerm = 'rety' квери параметр
	@Auth('admin')
	async getUsers(@Query('searchTerm') searchTerm?: string) {
		return this.userService.getAll(searchTerm)
	}

	// ПОЛУЧЕНИЕ профиля конкретного юзера АДМИНОМ
	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id', idValidationPipe) id: string) {
		return this.userService.byId(id)
	}
	// ОБНОВЛЕНИЕ записи юзера АДМИНОМ
	@UsePipes(new ValidationPipe())
	@Put(':id') // :id query param вытаскивается через декоратор @Param
	@HttpCode(200)
	@Auth('admin') // Должен быть имено admin
	async updateUser(
		// Админ меняет данные
		@Param('id', idValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}
	// УДАЛЕНИЕ записи юзера АДМИНОМ
	@Delete(':id') // :id query param вытаскивается через декоратор @Param
	@HttpCode(200)
	@Auth('admin') // Должен быть имено admin
	async deleteUser(
		// Админ меняет данные
		@Param('id', idValidationPipe) id: string
	) {
		return this.userService.delete(id)
	}
}
