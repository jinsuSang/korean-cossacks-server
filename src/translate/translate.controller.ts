import { Body, Controller, Post } from '@nestjs/common'
import { TranslateQueryDto } from './dto/translate-query.dto'
import { TranslateService } from './translate.service'

interface Response {
  result: string
}

@Controller('translate')
export class TranslateController {
  constructor(private translateService: TranslateService) {}

  @Post('papago')
  translateWithPapago(
    @Body() translateQueryDto: TranslateQueryDto,
  ): Promise<Response> {
    return this.translateService.translateWithPapago(translateQueryDto)
  }

  @Post('kakao')
  translateWithKakao(
    @Body() translateQueryDto: TranslateQueryDto,
  ): Promise<Response> {
    return this.translateService.translateWithKakao(translateQueryDto)
  }

  @Post('google')
  translateWithGoogle(
    @Body() translateQueryDto: TranslateQueryDto,
  ): Promise<Response> {
    return this.translateService.translateWithGoogle(translateQueryDto)
  }
}
