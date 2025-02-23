import { IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ParamDtoDeleteComment {
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

  @ApiProperty()
  comment_name: string
}
