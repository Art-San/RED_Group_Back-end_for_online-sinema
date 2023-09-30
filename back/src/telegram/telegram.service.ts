import { getTelegramConfig } from './../config/telegram.config'
import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'
import { Telegram } from './telegram.interface'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

@Injectable()
export class TelegramService {
	bot: Telegraf
	options: Telegram

	constructor() {
		this.options = getTelegramConfig()
		this.bot = new Telegraf(this.options.token)
	}

	async sendMessage(
		msg: string,
		options?: ExtraReplyMessage,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendMessage(chatId, msg, {
			parse_mode: 'HTML', // что бы HTML теги преобразовались в то для чего они прописаны
			...options,
		})
	}
	async sendPhoto(
		photo: string,
		msg?: string,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendPhoto(
			chatId,
			photo,
			msg
				? {
						caption: msg,
				  }
				: {}
		)
	}
}
