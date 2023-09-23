import { UserModel } from 'src/user/user.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

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
}
