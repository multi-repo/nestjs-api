import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserIdDto {
  @ApiProperty()
  @IsUUID()
  user_id: string
}
