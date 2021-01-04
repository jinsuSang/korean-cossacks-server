import { HttpService, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TranslationServiceClient } from '@google-cloud/translate'
import { TranslateQueryDto } from './dto/translate-query.dto'

@Injectable()
export class TranslateService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async translateWithPapago(translateQueryDto: TranslateQueryDto) {
    const { query, source, target } = translateQueryDto
    const api_url = this.configService.get<string>(
      'translation.papagoTranslateUrl',
    )

    try {
      const response = await this.httpService
        .post(
          api_url,
          { source: source, target: target, text: query },
          {
            headers: {
              'X-Naver-Client-Id': this.configService.get<string>(
                'translation.papagoClientId',
              ),
              'X-Naver-Client-Secret': this.configService.get<string>(
                'translation.papagoClientSecret',
              ),
            },
          },
        )
        .toPromise()
      const result = response.data.message.result.translatedText
      return { result }
    } catch (error) {
      console.log(error.message)
    }
  }

  async translateWithKakao(translateQueryDto: TranslateQueryDto) {
    const { query, source, target } = translateQueryDto

    const api_url = this.configService.get<string>(
      'translation.kakaoTranslateUrl',
    )
    try {
      const response = await this.httpService
        .post(api_url, null, {
          headers: {
            Authorization:
              'KakaoAK ' +
              this.configService.get<string>('translation.kakaoApiKey'),
          },
          params: {
            src_lang: source === 'ko' ? 'kr' : source,
            target_lang: target,
            query,
          },
        })
        .toPromise()
      const translatedTexts: string[][] = response.data.translated_text.map(
        (textsArr: string[]) => {
          if (textsArr.length === 0) return textsArr
          let combinedText = textsArr[0]
          for (let i = 1; i < textsArr.length; i++) {
            combinedText += ' ' + textsArr[i]
          }
          return [combinedText]
        },
      )
      let result = translatedTexts[0][0]
      for (let i = 1; i < translatedTexts.length; i++) {
        result +=
          translatedTexts[i].length === 0 ? '\n' : '\n' + translatedTexts[i][0]
      }
      return { result }
    } catch (error) {
      console.log(error.message)
    }
  }

  async translateWithGoogle(translateQueryDto: TranslateQueryDto) {
    const { query, source, target } = translateQueryDto
    const translationClient = new TranslationServiceClient({
      keyFilename: this.configService.get<string>(
        'translation.googleKeyFileName',
      ),
    })
    try {
      if (target === 'en') {
        const englishRequest = this.makeGoogleRequest(query, source, target)
        const [response] = await translationClient.translateText(englishRequest)
        const result = response.translations[0].translatedText
        return { result }
      } else if (target === 'uk') {
        const russianRequest = this.makeGoogleRequest(query, source, 'ru')
        const [russianResponse] = await translationClient.translateText(
          russianRequest,
        )
        const russianQuery = russianResponse.translations[0].translatedText

        const ukrainianRequest = this.makeGoogleRequest(
          russianQuery,
          'ru',
          target,
        )
        const [ukrainianResponse] = await translationClient.translateText(
          ukrainianRequest,
        )
        const result = ukrainianResponse.translations[0].translatedText
        return { result }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  makeGoogleRequest(query: string, source: string, target: string) {
    const projectId = this.configService.get<string>(
      'translation.googleProjectId',
    )

    const location = this.configService.get<string>(
      'translation.googleLocation',
    )
    return {
      parent: `projects/${projectId}/locations/${location}`,
      contents: [query],
      mimeType: 'text/plain', // mime types: text/plain, text/html
      sourceLanguageCode: source,
      targetLanguageCode: target,
    }
  }
}
