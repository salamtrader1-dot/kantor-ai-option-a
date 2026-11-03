/**
 * Telegram Bot Integration for Kantor AI
 * Webhook handler + commands
 */

import { supabaseAPI } from './supabaseAPI';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL || '';

interface TelegramMessage {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
}

export class TelegramBot {
  /**
   * Handle incoming webhook from Telegram
   */
  static async handleWebhook(payload: TelegramMessage) {
    if (!payload.message?.text) return;

    const chatId = payload.message.chat.id;
    const text = payload.message.text;
    const userName = payload.message.from.first_name;

    // Parse command
    if (text.startsWith('/')) {
      await this.handleCommand(text, chatId, userName);
    } else {
      // Log general message
      await supabaseAPI.logTelegramMessage(
        payload.message.from.id,
        userName,
        text,
        'message',
        'received'
      );

      // Echo confirmation
      await this.sendMessage(chatId, `✅ Got your message: "${text}"`);
    }
  }

  /**
   * Handle Telegram commands
   */
  private static async handleCommand(command: string, chatId: number, userName: string) {
    const cmd = command.split(' ')[0].toLowerCase();

    switch (cmd) {
      case '/start':
        await this.sendMessage(
          chatId,
          `🏢 Welcome to Kantor AI Virtual!\n\nCommands:\n/status - Team status\n/top - Top performers\n/alert - Set alert\n/help - More info`
        );
        break;

      case '/status':
        const staff = await supabaseAPI.getAllStaff();
        const message = `👥 Team Status (${staff.length} members):\n${staff
          .map((s) => `${s.emoji} ${s.name} - ${s.position}`)
          .join('\n')}`;
        await this.sendMessage(chatId, message);
        break;

      case '/top':
        const scores = await supabaseAPI.getPerformanceScores(new Date());
        const sorted = Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5);
        const topMessage = `🏆 Top 5 Performers:\n${sorted
          .map(([key, score], i) => `${i + 1}. ${key}: ${score} points`)
          .join('\n')}`;
        await this.sendMessage(chatId, topMessage);
        break;

      case '/help':
        await this.sendMessage(
          chatId,
          `📖 Help:\n\n/status - Show all team members\n/top - Top performers this week\n/alert [message] - Send alert to dashboard\n/stats - Personal stats\n/report - Daily report`
        );
        break;

      default:
        await this.sendMessage(chatId, `❓ Unknown command: ${cmd}`);
    }

    // Log command
    await supabaseAPI.logTelegramMessage(chatId, userName, command, 'command', 'processed');
  }

  /**
   * Send message via Telegram API
   */
  static async sendMessage(chatId: number, text: string) {
    try {
      const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        console.error('Telegram API error:', await response.text());
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  }

  /**
   * Send alert to Telegram group
   */
  static async sendAlert(groupId: number, alert: string) {
    await this.sendMessage(groupId, `🚨 <b>ALERT</b>\n${alert}`);
  }

  /**
   * Setup webhook (call once at startup)
   */
  static async setupWebhook() {
    try {
      const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ['message'],
        }),
      });

      const data = await response.json();
      console.log('✅ Telegram webhook setup:', data);
      return data;
    } catch (error) {
      console.error('❌ Webhook setup failed:', error);
    }
  }
}

export default TelegramBot;
