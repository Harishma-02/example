import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: 499,
    description: 'Payment amount in rupees',
  })
  amount: number;

  @ApiProperty({
    example: 'INR',
    description: 'Currency code (e.g., INR)',
  })
  currency: string;

  @ApiPropertyOptional({
    example: 'Payment for premium subscription',
    description: 'Optional payment description',
  })
  description?: string;
}
