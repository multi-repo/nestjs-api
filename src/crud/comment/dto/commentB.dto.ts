import { IsString, IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ParamBDtoComment {
  @ApiProperty()
  @IsUUID()
  @Expose()
  user_id: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  column_id: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  card_id: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  comment_name: string
}
