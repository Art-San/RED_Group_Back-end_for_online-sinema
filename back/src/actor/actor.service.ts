import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorModel } from './actor.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ActorDto } from './actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async bySlug(slug: string) {
		return this.ActorModel.findOne({ slug }).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i'), // i значит независимо от регистра
					},
					{
						slug: new RegExp(searchTerm, 'i'), // i значит независимо от регистра
					},
				],
			}
		}

		/*TODO: Aggregation будет связана с моделью МУВИ*/
		return this.ActorModel.find(options)
			.select('-updatedAt -__v') // Эти поля не получаем
			.sort({ createdAt: 'desc' }) // сначало новые
			.exec()
	}

	/*Admin place*/

	async byId(_id: string) {
		const actor = await this.ActorModel.findById(_id)
		if (!actor) {
			throw new NotFoundException('Жанр не найден')
		}
		return actor
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		}
		const actor = await this.ActorModel.create(defaultValue)
		return actor._id
	}

	async update(_id: string, dto: ActorDto) {
		const updateDoc = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true, // означает что будем отдавать измененный actor
		}).exec()

		if (!updateDoc) throw new NotFoundException('Жанр не найден')

		return updateDoc
	}

	async delete(id: string) {
		// const deleteDoc = this.ActorModel.findByIdAndDelete(id).exec()
		const deleteDoc = await this.ActorModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Жанр не найден')

		return deleteDoc
	}
}
