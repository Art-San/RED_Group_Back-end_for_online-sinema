import { IsString, MinLength } from 'class-validator'

export class AuthDto {
  @IsString()
  email: string

  @MinLength(6, {
    message: 'Пароль должен содержать не менее 6 символов',
  })
  @IsString()
  password: string
}
