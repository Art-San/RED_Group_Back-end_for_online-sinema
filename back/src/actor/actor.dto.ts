import { IsString } from 'class-validator'

export class ActorDto {
	@IsString()
	name: string

	@IsString()
	slug: string

	@IsString()
	photo: string
}

// Такая структура для более крупных проектов
// {
//     name: string
//     url: string
//     size: string
//     _id: string
// }
