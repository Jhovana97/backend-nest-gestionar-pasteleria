import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//HABILITA CONFIGURACION .ENV
import { ConfigModule } from '@nestjs/config';
//HABILITA CONEXION A BASE DE DATOS
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogsAccesoModule } from './modules/logs-acceso/logs-acceso.module';


@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +`${process.env.DATABASE_PORT}`,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
       // url: process.env.DATABASE_URL,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    CategoriasModule,
    ProductosModule,
    ClientesModule,
    PedidosModule,
    PagosModule,
    AuthModule,
    LogsAccesoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
