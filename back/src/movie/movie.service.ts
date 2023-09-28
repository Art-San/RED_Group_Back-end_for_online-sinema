import { MovieModel } from './movie.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UpdateMovieDto } from './update.movie.dto'
import { Types } from 'mongoose'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>
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

		return this.movieModel
			.find(options)
			.select('-updatedAt -__v') // Эти поля не получаем
			.sort({ createdAt: 'desc' }) // сначало новые
			.populate('actors genres')
			.exec()
	}

	async bySlug(slug: string) {
		const doc = await this.movieModel
			.findOne({ slug })
			.populate('actors genres')
			.exec() // populate('actors genres') Рассказывал про это в первом интенсиве
		if (!doc) {
			throw new NotFoundException('По слагу Movie не найден')
		}
		return doc
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = await this.movieModel.find({ actors: actorId }).exec() // По одному актеру
		if (!docs) {
			throw new NotFoundException('Movies не найден')
		}
		return docs
	}

	// Этот вариант из урока, почему у него не работало так я и не понял.
	// нельзя передавать не правильный ID
	async byGenres(genreIds: Types.ObjectId[]) {
		const docs = await this.movieModel
			.find({
				genres: { $in: genreIds },
			})
			.exec()

		if (!docs) {
			throw new NotFoundException('Movies не найден')
		}
		return docs
	}

	// Этот вариант из конечного  проекта
	// async byGenres(
	// 	genreIds: Types.ObjectId[]
	// ): Promise<DocumentType<MovieModel>[]> {
	// 	return this.movieModel.find({ genres: { $in: genreIds } }).exec()
	// }

	async getMostPopular() {
		return this.movieModel
			.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async updateCountOpened(slug: string) {
		const updateDoc = await this.movieModel
			.findOneAndUpdate(
				{ slug },
				{
					$inc: { countOpened: 1 },
				},
				{
					new: true,
				}
			)
			.exec()

		if (!updateDoc) throw new NotFoundException('Фильм не найден')

		return updateDoc
	}

	/*Admin place*/

	async byId(_id: string) {
		const doc = await this.movieModel.findById(_id)
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
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}
		const doc = await this.movieModel.create(defaultValue)
		return doc._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		/*TODO: TELEGRAM notification*/

		const updateDoc = await this.movieModel
			.findByIdAndUpdate(_id, dto, {
				new: true, // означает что будем отдавать измененного актера
			})
			.exec()

		if (!updateDoc) throw new NotFoundException('Movie не найден')

		return updateDoc
	}

	async delete(id: string) {
		const deleteDoc = await this.movieModel.findByIdAndDelete(id).exec()

		if (!deleteDoc) throw new NotFoundException('Фильм не найден')

		return deleteDoc
	}
}
