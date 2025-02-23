import { IsString, IsUUID, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DtoCreateCard {
  @IsUUID()
  user_id: string

  @ApiProperty()
  @IsString()
  column_name: string

  @IsOptional()
  @IsUUID()
  column_id: string

  @ApiProperty()
  @IsString()
  card_name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string
}
