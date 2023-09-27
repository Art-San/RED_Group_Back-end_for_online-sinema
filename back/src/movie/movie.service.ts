import { MovieModel } from './movie.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'

import { UpdateMovieDto } from './update.movie.dto'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
	) {}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'), // i значит независимо от регистра
					},
				],
			}
		}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v') // Эти поля не получаем
			.sort({ createdAt: 'desc' }) // сначало новые
			.populate('actors genres')
			.exec()
	}
	// 02: 38
	async bySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec() // populate('actors genres') расказывал про это в первом интенсиве
		if (!doc) {
			throw new NotFoundException('По слагу Movie не найден')
		}
		return doc
	}

	async bySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!doc) {
			throw new NotFoundException('По слагу Movie не найден')
		}
		return doc
	}

	async bySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()
		if (!doc) {
			throw new NotFoundException('По слагу Movie не найден')
		}
		return doc
	}

	/*Admin place*/

	async byId(_id: string) {
		const doc = await this.MovieModel.findById(_id)
		if (!doc) {
			throw new NotFoundException('Фильм не найден')
		}
		return doc
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			name: '',
			slug: '',
		}
		const doc = await this.MovieModel.create(defaultValue)
		return doc._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true, // означает что будем отдавать измененного актера
		}).exec()

		if (!updateDoc) throw new NotFoundException('Фильм не найден')

		return updateDoc
	}

	async delete(id: string) {
		// const deleteDoc = this.MovieModel.findByIdAndDelete(id).exec()
		const deleteDoc = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Фильм не найден')

		return deleteDoc
	}
}
