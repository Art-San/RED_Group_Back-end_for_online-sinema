import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsString,
} from 'class-validator'

export class Parameters {
	@IsNumber()
	poster: number

	@IsNumber()
	duration: number

	@IsString()
	country: string
}

export class CreateMovieDto {
	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsString()
	title: string

	@IsString()
	description: string

	@IsString()
	slug: string

	@IsObject()
	parameters?: Parameters

	@IsString()
	videoUrl: string

	@IsArray() // Будет массив
	@IsString({ each: true }) // Каждый элемент массива строка
	@IsArray()
	@IsString({ each: true })
	actors: string[]

	@IsBoolean()
	isSendTelegram?: boolean
}
