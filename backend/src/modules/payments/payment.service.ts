import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentDto } from '../users/dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }


  async createPaymentIntent(dto: CreatePaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: dto.amount * 100,     
      currency: dto.currency,
      description: dto.description,
      automatic_payment_methods: { enabled: true },
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
    };
  }


  async checkPaymentStatus(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const successData = event.data.object;
        console.log('Payment Success:', successData.id);
        break;

      case 'payment_intent.payment_failed':
        const failedData = event.data.object;
        console.log('Payment Failed:', failedData.id);
        break;

      default:
        console.log('Unhandled event:', event.type);
    }
  }
}
