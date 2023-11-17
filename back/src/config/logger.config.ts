import winston from 'winston'

// не хочет работать Отключил
const logger = winston.createLogger({
	level: 'info',
	// format: winston.format.json() тут что то не так
	format: winston.format.simple(),
	transports: [
		new winston.transports.Console(),
		// Добавьте здесь другие транспорты логирования по необходимости
	],
})

export default logger
