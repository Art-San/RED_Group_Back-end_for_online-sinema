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

		// https://mongoosejs.com/docs/api/aggregate.html
		/*TODO: Aggregation будет связана с моделью МУВИ*/
		return (
			this.actorModel
				.aggregate()
				.match(options)
				.lookup({
					// делаем перебор Pipeline
					from: 'Movie', // взяли модель Movie
					localField: '_id',
					foreignField: 'actors', // actors являются айдишниками
					as: 'movies',
				})
				// .lookup({
				// 	from: 'Movie',
				// 	let: { id: '$_id' },
				// 	pipeline: [
				// 		{
				// 			$match: { $expr: { $in: ['$$id', '$actors'] } },
				// 		},
				// 	],
				// 	as: 'movies',
				// })
				.addFields({
					countMovies: { $size: '$movies' },
				})
				.project({ __v: 0, updatedAt: 0, movies: 0 }) // project вместо select убираем
				.sort({ createdAt: -1 }) // "desc и asc" тут не работают
				.exec()
		)
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
