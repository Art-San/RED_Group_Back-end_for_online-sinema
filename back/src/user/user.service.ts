import { UserModel } from 'src/user/user.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { UpdateUserDto } from './dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'

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
}
