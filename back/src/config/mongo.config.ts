import { ConfigService } from '@nestjs/config' // Доступ до ENV
import { TypegooseModuleOptions } from 'nestjs-typegoose'

export const getMongoConfig = async (
  configService: ConfigService
): Promise<TypegooseModuleOptions> => ({
  uri: configService.get('MONGO_URI'),
})
