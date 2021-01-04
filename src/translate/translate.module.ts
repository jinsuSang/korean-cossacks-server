import { HttpModule, Module } from '@nestjs/common'
import { TranslateService } from './translate.service'
import { TranslateController } from './translate.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [TranslateService],
  controllers: [TranslateController],
})
export class TranslateModule {}
