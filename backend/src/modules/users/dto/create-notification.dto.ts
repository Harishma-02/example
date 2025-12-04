import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../../../shared/types/notification-type.enum';

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.EMAIL,
    description: "Type of notification: 'email' | 'sms' | 'push'",
  })
  type: NotificationType;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Receiver email, phone number, or device token',
  })
  to: string;

  @ApiPropertyOptional({
    example: 'New Message',
    description: 'Title for push notifications only',
  })
  title?: string;

  @ApiProperty({
    example: 'Your order has been shipped!',
    description: 'Main notification message content',
  })
  message: string;
}
