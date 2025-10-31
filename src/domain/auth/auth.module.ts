import { Module } from '@nestjs/common';
import { JWT } from 'src/domain/auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT.SECRET,
        signOptions: { expiresIn: JWT.EXPIRES_IN },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
