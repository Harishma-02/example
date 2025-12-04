import { Controller, Post, Body, Get, Param, Headers, Req, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { Request } from 'express';
import { CreatePaymentDto } from '../users/dto/create-payment.dto';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

 
  @Post('create')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPaymentIntent(dto);
  }


  @Get('status/:id')
  checkStatus(@Param('id') id: string) {
    return this.paymentService.checkPaymentStatus(id);
  }


  @Post('webhook')
  async webhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature?: string,
  ) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

   
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY missing in .env');
    }

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET missing in .env');
    }

    if (!signature) {
      throw new BadRequestException('Stripe signature missing');
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req['rawBody'] as Buffer,  
        signature,          
        webhookSecret,       
      );

      await this.paymentService.handleWebhook(event);

      return { received: true };
    } catch (err) {
      console.log('Webhook Error:', err);
      return { error: 'Invalid signature' };
    }
  }
}
