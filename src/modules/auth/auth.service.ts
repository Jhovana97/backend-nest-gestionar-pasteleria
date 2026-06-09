import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(
        email: string,
        pass: string,
    ): Promise<{ access_token: string, user: Record<string, any> }> {
        const user = await this.usersService.findOneByEmail(email);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.nombre };

        return {
            // 💡 Here the JWT secret key that's used for signing the payload 
            // is the key that was passed in the JwtModule
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email
                // ❌ NO DEVUELVAS password
            }
        };
    }
}
