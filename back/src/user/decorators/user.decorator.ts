import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserModel } from '../user.model'

// Получаем текущего юзера (авторизованного)
// https://docs.nestjs.com/custom-decorators
type TypeData = keyof UserModel
export const User = createParamDecorator(
	(data: TypeData, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user
		// console.log('data', data) // _id

		return data ? user[data] : user
	}
)
