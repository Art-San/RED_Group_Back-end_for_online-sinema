import { IsString } from 'class-validator'

export class CreateGenreDto {
	@IsString()
	name: string

	@IsString()
	slog: string

	@IsString()
	description: string

	@IsString()
	icon: string
}

// 3:03
