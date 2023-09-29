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
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { idValidationPipe } from 'src/pipes/id.validation.pipe'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserModel } from './user.model'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	// @Auth('admin')
	@Auth() // Самописный декоратор user || admin
	async getProfile(@User('_id') _id: string) {
		return this.userService.byId(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile') // обновление юзера
	@HttpCode(200) //Ставим 200 везде где Put или Post
	@Auth() // Должен быть авторизован
	// @User custom-decorators
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		// сам юзер обновляет данные
		return this.userService.updateProfile(_id, dto)
	}

	@Get('profile/favorites')
	@Auth()
	async getFavorites(@User('_id') _id: string) {
		return this.userService.getFavoriteMovies(_id)
	}

	@Put('profile/favorites')
	@HttpCode(200)
	@Auth()
	async toggleFavorite(
		@Body('movieId', idValidationPipe) movieId: Types.ObjectId,
		@User() user: UserModel
	) {
		return this.userService.toggleFavorite(movieId, user)
	}
	// Это с конечного файла
	// @Post('profile/favorites')
	// @HttpCode(200)
	// @Auth()
	// async toggleFavorite(
	// 	@Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
	// 	@User() user: UserModel
	// ) {
	// 	return this.userService.toggleFavorite(movieId, user)
	// }

	@Get('count')
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
