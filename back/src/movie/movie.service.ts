import { MovieModel } from './movie.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateMovieDto } from './update.movie.dto'
import { Types } from 'mongoose'

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

	async bySlug(slug: string) {
		const doc = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec() // populate('actors genres') Рассказывал про это в первом интенсиве
		if (!doc) {
			throw new NotFoundException('По слагу Movie не найден')
		}
		return doc
	}

	async byActor(actorId: string) {
		const docs = await this.MovieModel.find({ actors: actorId }).exec() // По одному актеру
		if (!docs) {
			throw new NotFoundException('Movies не найден')
		}
		return docs
	}

	async byGenre(genreIds: Types.ObjectId[]) {
		const docs = await this.MovieModel.find({
			genres: { $in: genreIds },
		}).exec()

		if (!docs) {
			throw new NotFoundException('Movies не найден')
		}
		return docs
	}

	async getMostPopular() {
		return this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 },
			}
		).exec()

		if (!updateDoc) throw new NotFoundException('Фильм не найден')

		return updateDoc
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
			bigPoster: '',
			actors: [],
			genres: [],
			description: '',
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}
		const doc = await this.MovieModel.create(defaultValue)
		return doc._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		/*TODO: TELEGRAM notification*/

		const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true, // означает что будем отдавать измененного актера
		}).exec()

		if (!updateDoc) throw new NotFoundException('Movie не найден')

		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Фильм не найден')

		return deleteDoc
	}
}
