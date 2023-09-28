import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
// import { TelegramService } from 'src/telegram/telegram.service'

import { CreateMovieDto } from './dto/create-movie.dto'
import { MovieModel } from './movie.model'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel> // private readonly telegramService: TelegramService
	) {}

	async getAll(searchTerm?: string): Promise<DocumentType<MovieModel>[]> {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.movieModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('genres actors')
			.exec()
	}

	async bySlug(slug: string): Promise<DocumentType<MovieModel>> {
		return this.movieModel.findOne({ slug }).populate('genres actors').exec()
	}

	async byActor(actorId: Types.ObjectId): Promise<DocumentType<MovieModel>[]> {
		return this.movieModel.find({ actors: actorId }).exec()
	}

	async byGenres(
		// Вроде понял,  нельзя передавать не правильный ID
		genreIds: Types.ObjectId[]
	): Promise<DocumentType<MovieModel>[]> {
		const genres = await this.movieModel
			.find({ genres: { $in: genreIds } })
			.exec()
		return genres
		// return this.movieModel.find({ genres: { $in: genreIds } }).exec()
	}

	async updateCountOpened(slug: string) {
		return this.movieModel
			.findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } })
			.exec()
	}

	/* Admin area */

	async byId(id: string): Promise<DocumentType<MovieModel>> {
		return this.movieModel.findById(id).exec()
	}

	async create(): Promise<Types.ObjectId> {
		const defaultValue: CreateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			description: '',
			poster: '',
			title: '',
			videoUrl: '',
			slug: '',
		}
		const movie = await this.movieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: CreateMovieDto) {
		/*TODO: TELEGRAM notification*/

		const updateDoc = await this.movieModel
			.findByIdAndUpdate(_id, dto, {
				new: true, // означает что будем отдавать измененного актера
			})
			.exec()

		if (!updateDoc) throw new NotFoundException('Movie не найден')

		return updateDoc
	}

	// async update(
	// 	id: string,
	// 	dto: CreateMovieDto
	// ): Promise<DocumentType<MovieModel> | null> {
	// 	if (!dto.isSendTelegram) {
	// 		await this.sendNotifications(dto)
	// 		dto.isSendTelegram = true
	// 	}

	// 	return this.movieModel.findByIdAndUpdate(id, dto, { new: true }).exec()
	// }

	async delete(id: string): Promise<DocumentType<MovieModel> | null> {
		return this.movieModel.findByIdAndDelete(id).exec()
	}

	async getMostPopular(): Promise<DocumentType<MovieModel>[]> {
		return this.movieModel
			.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async updateRating(id: string, newRating: number) {
		return this.movieModel
			.findByIdAndUpdate(id, { rating: newRating }, { new: true })
			.exec()
	}

	/* Utilites */
	// async sendNotifications(dto: CreateMovieDto) {
	// 	if (process.env.NODE_ENV !== 'development')
	// 		await this.telegramService.sendPhoto(dto.poster)

	// 	const msg = `<b>${dto.title}</b>\n\n` + `${dto.description}\n\n`

	// 	await this.telegramService.sendMessage(msg, {
	// 		reply_markup: {
	// 			inline_keyboard: [
	// 				[
	// 					{
	// 						url: 'https://okko.tv/movie/free-guy',
	// 						text: '🍿 Go to watch',
	// 					},
	// 				],
	// 			],
	// 		},
	// 	})
	// }
}

// import { MovieModel } from './movie.model'
// import { ModelType } from '@typegoose/typegoose/lib/types'
// import { Injectable, NotFoundException } from '@nestjs/common'
// import { InjectModel } from 'nestjs-typegoose'
// import { UpdateMovieDto } from './update.movie.dto'
// import { Types } from 'mongoose'

// @Injectable()
// export class MovieService {
// 	constructor(
// 		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>
// 	) {}

// 	async getAll(searchTerm?: string) {
// 		let options = {}

// 		if (searchTerm) {
// 			options = {
// 				$or: [
// 					{
// 						title: new RegExp(searchTerm, 'i'), // i значит независимо от регистра
// 					},
// 				],
// 			}
// 		}

// 		return this.movieModel
// 			.find(options)
// 			.select('-updatedAt -__v') // Эти поля не получаем
// 			.sort({ createdAt: 'desc' }) // сначало новые
// 			.populate('actors genres')
// 			.exec()
// 	}

// 	async bySlug(slug: string) {
// 		const doc = await this.movieModel
// 			.findOne({ slug })
// 			.populate('actors genres')
// 			.exec() // populate('actors genres') Рассказывал про это в первом интенсиве
// 		if (!doc) {
// 			throw new NotFoundException('По слагу Movie не найден')
// 		}
// 		return doc
// 	}

// 	async byActor(actorId: Types.ObjectId) {
// 		const docs = await this.movieModel.find({ actors: actorId }).exec() // По одному актеру
// 		if (!docs) {
// 			throw new NotFoundException('Movies не найден')
// 		}
// 		return docs
// 	}

// 	async byGenres(genreIds: Types.ObjectId[]) {
// 		const docs = await this.movieModel
// 			.find({
// 				genres: { $in: genreIds },
// 			})
// 			.exec()

// 		if (!docs) {
// 			throw new NotFoundException('Movies не найден')
// 		}
// 		return docs
// 	}

// 	async getMostPopular() {
// 		return this.movieModel
// 			.find({ countOpened: { $gt: 0 } })
// 			.sort({ countOpened: -1 })
// 			.populate('genres')
// 			.exec()
// 	}

// 	async updateCountOpened(slug: string) {
// 		const updateDoc = await this.movieModel
// 			.findOneAndUpdate(
// 				{ slug },
// 				{
// 					$inc: { countOpened: 1 },
// 				},
// 				{
// 					new: true,
// 				}
// 			)
// 			.exec()

// 		if (!updateDoc) throw new NotFoundException('Фильм не найден')

// 		return updateDoc
// 	}

// 	/*Admin place*/

// 	async byId(_id: string) {
// 		const doc = await this.movieModel.findById(_id)
// 		if (!doc) {
// 			throw new NotFoundException('Фильм не найден')
// 		}
// 		return doc
// 	}

// 	async create() {
// 		const defaultValue: UpdateMovieDto = {
// 			bigPoster: '',
// 			actors: [],
// 			genres: [],
// 			poster: '',
// 			title: '',
// 			videoUrl: '',
// 			slug: '',
// 		}
// 		const doc = await this.movieModel.create(defaultValue)
// 		return doc._id
// 	}

// 	async update(_id: string, dto: UpdateMovieDto) {
// 		/*TODO: TELEGRAM notification*/

// 		const updateDoc = await this.movieModel
// 			.findByIdAndUpdate(_id, dto, {
// 				new: true, // означает что будем отдавать измененного актера
// 			})
// 			.exec()

// 		if (!updateDoc) throw new NotFoundException('Movie не найден')

// 		return updateDoc
// 	}

// 	async delete(id: string) {
// 		const deleteDoc = await this.movieModel.findByIdAndDelete(id).exec()

// 		if (!deleteDoc) throw new NotFoundException('Фильм не найден')

// 		return deleteDoc
// 	}
// }
