import { IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ParamDtoCreateComment {
  @Expose()
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  user_id: string

  @ApiProperty()
  @IsString()
  column_name: string

  @ApiProperty()
  @IsString()
  card_name: string
}
