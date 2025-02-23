import { IsOptional, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class ParamDtoCreateCard {
  @Expose()
  @ApiProperty()
  @IsString()
  column_name: string

  @Expose()
  @IsOptional()
  @IsUUID()
  user_id: string
}
