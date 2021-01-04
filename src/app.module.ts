import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { TranslateModule } from './translate/translate.module'

@Module({
  imports: [TranslateModule, ConfigModule.forRoot({ load: [configuration] })],
})
export class AppModule {}
