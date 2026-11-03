/**
 * API Route: Telegram Webhook Handler
 * POST /api/telegram/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from '@/lib/telegramBot';

// Verify webhook is from Telegram (basic security)
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Verify token in webhook (optional but recommended)
    const token = request.headers.get('x-telegram-bot-api-secret-token');
    if (token !== TELEGRAM_TOKEN) {
      console.warn('⚠️ Invalid Telegram token');
      // Still process for now (you can make this stricter)
    }

    // Handle webhook
    await TelegramBot.handleWebhook(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Telegram webhook endpoint active',
    endpoint: '/api/telegram/webhook',
  });
}
