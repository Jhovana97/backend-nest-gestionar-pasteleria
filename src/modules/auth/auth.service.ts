import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
        throw new UnauthorizedException('Password incorrecta');
    }

    const payload = { sub: user.id, username: user.nombre };

    return {
        access_token: await this.jwtService.signAsync(payload),
        user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }
    };
}
}