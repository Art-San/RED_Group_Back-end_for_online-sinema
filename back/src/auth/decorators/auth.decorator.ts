import { applyDecorators, UseGuards } from '@nestjs/common'
import { TypeRole } from '../auth.interface'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

export function Auth(role: TypeRole = 'user') {
	return applyDecorators(
		//applyDecorators объединяет декораторы (Для композиции)
		role === 'admin'
			? UseGuards(JwtAuthGuard, OnlyAdminGuard)
			: UseGuards(JwtAuthGuard)
	)
}
