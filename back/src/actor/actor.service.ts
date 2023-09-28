import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorModel } from './actor.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ActorDto } from './actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly actorModel: ModelType<ActorModel>
	) {}

	async bySlug(slug: string) {
		const doc = await this.actorModel.findOne({ slug }).exec() // DOC - универсальное обозначение
		if (!doc) {
			throw new NotFoundException('По слагу Actor не найден')
		}
		return doc
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
		return this.actorModel
			.find(options)
			.select('-updatedAt -__v') // Эти поля не получаем
			.sort({ createdAt: 'desc' }) // сначало новые
			.exec()
	}

	/*Admin place*/

	async byId(_id: string) {
		const actor = await this.actorModel.findById(_id)
		if (!actor) {
			throw new NotFoundException('Актер не найден')
		}
		return actor
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: '',
		}
		const actor = await this.actorModel.create(defaultValue)
		return actor._id
	}

	async update(_id: string, dto: ActorDto) {
		const updateDoc = await this.actorModel
			.findByIdAndUpdate(_id, dto, {
				new: true, // означает что будем отдавать измененного актера
			})
			.exec()

		if (!updateDoc) throw new NotFoundException('Актер не найден')

		return updateDoc
	}

	async delete(id: string) {
		// const deleteDoc = this.actorModel.findByIdAndDelete(id).exec()
		const deleteDoc = await this.actorModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Актер не найден')

		return deleteDoc
	}
}
