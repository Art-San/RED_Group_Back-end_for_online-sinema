// проверяем точно ли id от MongoDb

import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from '@nestjs/common'
import { Types } from 'mongoose'

export class idValidationPipe implements PipeTransform {
	transform(value: string, meta: ArgumentMetadata) {
		if (meta.type !== 'param') {
			return value
		}

		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Неправильный формат ID')
		}

		return value
	}
}
