import { UserModel } from 'src/user/user.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from './dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}
	async byId(_id: string) {
		const user = await this.UserModel.findById(_id)
		if (!user) {
			throw new NotFoundException('Юзер не найден')
		}
		return user
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.byId(_id)
		const isSameUser = await this.UserModel.findOne({ email: dto.email })
		if (isSameUser && String(_id) !== String(isSameUser._id)) {
			throw new NotFoundException('Email занят')
		}

		if (dto.password) {
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email
		if (dto.isAdmin || dto.isAdmin === false) {
			user.isAdmin = dto.isAdmin
		}
		await user.save()
		return { message: 'Пользователь успешно обновлен' }
	}

	async getCount() {
		return this.UserModel.find().count().exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i'), // i значит независимо от регистра
					},
				],
			}
		}
		return this.UserModel.find(options)
			.select('-password -updatedAt -__v') // Эти поля не получаем
			.sort({ createdAt: 'desc' }) // сначало новые
			.exec()
	}

	async delete(id: string) {
		return this.UserModel.findByIdAndDelete(id).exec()
	}

	async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
		const { _id, favorites } = user
		await this.UserModel.findByIdAndUpdate(_id, {
			favorites: favorites.includes(movieId) // проверяем есть ль такой ID в избранном
				? favorites.filter((id) => String(id) !== String(movieId)) // если есть то удаляем
				: [...favorites, movieId], // Если нет, то добавляем
			// : favorites.push(movieId), // я так хотел сделать
		})
	}

	async getFavoriteMovies(_id: Types.ObjectId) {
		return this.UserModel.findById(_id, 'favorites') // второй параметр 'favorites' говорит что мы хотим получить
	}
}
