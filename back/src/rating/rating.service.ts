import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { MovieService } from 'src/movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'
import { RatingModel } from './rating.model'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly ratingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService // MovieService предварительно заимпортили в rating.module.ts, здесь просто описываем
	) {}

	async getMovieByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return this.ratingModel
			.findOne({ movieId: movieId, userId: userId })
			.select('value')
			.exec()
			.then((data) => (data ? data.value : 0)) // если не будет этого выражения то может приходить undefined
	}

	async averageRatingMovie(movieId: Types.ObjectId | string) {
		const ratingMovie: RatingModel[] = await this.ratingModel
			.aggregate()
			.match({
				movieId: new Types.ObjectId(movieId), // если movieId будет строкой Types.ObjectId() превратит ObjectId
			})
			.exec()

		return (
			ratingMovie.reduce((acc, item) => acc + item.value, 0) /
			ratingMovie.length
		)
	}

	async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId, value } = dto

		const newRating = await this.ratingModel
			.findByIdAndUpdate(
				{ movieId, userId },
				{
					movieId: movieId,
					userId: userId,
					value: value,
				},
				{
					new: true, // что бы вернулось новое
					upsert: true, // для того что бы создать новое если нету
					setDefaultsOnInsert: true, // для того что бы создать новое если нету
				}
			)
			.exec() // это обязательно

		const averageRating = await this.averageRatingMovie(movieId)

		// TODO: await.this.movieService

		return newRating
	}
}
