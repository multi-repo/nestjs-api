import { IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ParamDtoUser {
  @ApiProperty()
  @IsUUID()
  user_id: string

  @ApiProperty()
  username: string
}
