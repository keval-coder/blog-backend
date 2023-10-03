import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [UserModule, AuthModule, BlogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

/** Tasks ***
 * Find login user and store into blog.
 * fetch all blogs user wise. (admin can access all blogs.)
 * blog like feature
 * blog comment feature
 */
