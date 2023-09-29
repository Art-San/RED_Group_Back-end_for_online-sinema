// import { Module } from '@nestjs/common'
// import { TypegooseModule } from 'nestjs-typegoose'
// import { MovieModule } from 'src/movie/movie.module'
// import { RatingController } from './rating.controller'
// import { RatingModel } from './rating.model'
// import { RatingService } from './rating.service'

// @Module({
// 	imports: [
// 		TypegooseModule.forFeature([
// 			{
// 				typegooseClass: RatingModel,
// 				schemaOptions: {
// 					collection: 'Rating',
// 				},
// 			},
// 		]),
// 		MovieModule, // Те сервисы которые есть MovieModule будем использовать Rating
// 	],
// 	controllers: [RatingController],
// 	providers: [RatingService],
// })
// export class RatingModule {}

import { Module } from '@nestjs/common'
import { RatingService } from './rating.service'
import { RatingController } from './rating.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { RatingModel } from './rating.model'
import { MovieModule } from 'src/movie/movie.module'

@Module({
	controllers: [RatingController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: RatingModel,
				schemaOptions: {
					collection: 'Rating',
				},
			},
		]),
		MovieModule,
	],
	providers: [RatingService],
	exports: [RatingService],
})
export class RatingModule {}
