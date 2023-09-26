import { Module } from '@nestjs/common'
import { FileController } from './file.controller'

import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { FilesService } from './file.service'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`, // путь куда сохраняем файлы
			serveRoot: '/uploads',
		}),
	],
	controllers: [FileController],
	providers: [FilesService],
})
export class FileModule {}
