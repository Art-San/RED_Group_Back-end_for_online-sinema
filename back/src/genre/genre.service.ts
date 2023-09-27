import { CreateGenreDto } from './genre.inteface'
import { GenreModel } from './genre.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async bySlug(slug: string) {
		const doc = await this.GenreModel.findOne({ slug }).exec() // DOC - универсальное обозначение
		if (!doc) {
			throw new NotFoundException('Ни чего не найдено')
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
					{
						description: new RegExp(searchTerm, 'i'), // i значит независимо от регистра
					},
				],
			}
		}
		return this.GenreModel.find(options)
			.select('-updatedAt -__v') // Эти поля не получаем
			.sort({ createdAt: 'desc' }) // сначало новые
			.exec()
	}

	async getCollections() {
		const genres = await this.getAll()
		const collections = genres
		/** FIXME: NEED write*/
		return collections
	}

	/*Admin place*/

	async byId(_id: string) {
		const genre = await this.GenreModel.findById(_id)
		if (!genre) {
			throw new NotFoundException('Жанр не найден')
		}
		return genre
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}
		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateDoc = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true, // означает что будем отдавать измененный genre
		}).exec()

		if (!updateDoc) throw new NotFoundException('Жанр не найден')

		return updateDoc
	}

	async delete(id: string) {
		// const deleteDoc = this.GenreModel.findByIdAndDelete(id).exec()
		const deleteDoc = await this.GenreModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Жанр не найден')

		return deleteDoc
	}
}
