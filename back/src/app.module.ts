import { getMongoConfig } from './config/mongo.config'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { GenreModule } from './genre/genre.module'
import { FileModule } from './files/file.module'
import { ActorModule } from './actor/actor.module'
import { MovieModule } from './movie/movie.module'
import { RatingModule } from './rating/rating.module'
import { TelegramModule } from './telegram/telegram.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		UserModule,
		GenreModule,
		FileModule,
		ActorModule,
		MovieModule,
		RatingModule,
		TelegramModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

// import { getMongoConfig } from './config/mongo.config'
// import { Module } from '@nestjs/common'
// import { ConfigModule, ConfigService } from '@nestjs/config'
// import { TypegooseModule } from 'nestjs-typegoose'
// import { AppController } from './app.controller'
// import { AppService } from './app.service'
// import { AuthModule } from './auth/auth.module'
// import { UserModule } from './user/user.module'
// import { GenreModule } from './genre/genre.module'
// import { FileModule } from './files/file.module'
// import { ActorModule } from './actor/actor.module'
// import { MovieModule } from './movie/movie.module'
// import { RatingModule } from './rating/rating.module'
// import { TelegramModule } from './telegram/telegram.module'
// import logger from './config/logger.config'

// @Module({
// 	imports: [
// 		ConfigModule.forRoot(),
// 		TypegooseModule.forRootAsync({
// 			imports: [ConfigModule],
// 			inject: [ConfigService],
// 			useFactory: async (configService: ConfigService) => {
// 				const mongoConfig = getMongoConfig(configService) // Получение конфигурации MongoD
// 				logger.info('Connecting to MongoDB...') // Логирование подключения к базе данных
// 				return {
// 					...mongoConfig,
// 					// Остальные опции подключения
// 				}
// 			},
// 		}),
// 		AuthModule,
// 		UserModule,
// 		GenreModule,
// 		FileModule,
// 		ActorModule,
// 		MovieModule,
// 		RatingModule,
// 		TelegramModule,
// 	],
// 	controllers: [AppController],
// 	providers: [AppService],
// })
// export class AppModule {}
