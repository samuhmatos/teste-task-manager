import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

const modules = [UserModule, AuthModule];
@Module({
  imports: [...modules],
})
export class DomainModule {}
