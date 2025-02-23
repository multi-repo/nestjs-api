import { IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ParamDtoDeleteCard {
  @Expose()
  @IsUUID()
  @IsOptional()
  user_id: string
  @Expose()
  @ApiProperty()
  @IsString()
  column_name: string

  @Expose()
  @ApiProperty()
  @IsString()
  card_name: string
}
