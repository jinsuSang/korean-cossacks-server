import { IsNotEmpty, IsString } from 'class-validator'

export class TranslateQueryDto {
  @IsNotEmpty()
  @IsString()
  query: string

  @IsNotEmpty()
  @IsString()
  source: string

  @IsNotEmpty()
  @IsString()
  target: string
}
