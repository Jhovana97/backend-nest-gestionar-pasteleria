import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {

  const hashedPassword = await bcrypt.hash(
    createUserDto.password,
    10,
  );

  const user = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword,
  });

  return this.userRepository.save(user);
}

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
//dbe editarse el pathc como el postcon bcrypt para hashear la contraseña
  async update(id: number, updateUserDto: UpdateUserDto) {
  const user = await this.findOne(id);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (updateUserDto.password) {
    updateUserDto.password = await bcrypt.hash(
      updateUserDto.password,
      15,
    );
  }

  Object.assign(user, updateUserDto);

  return this.userRepository.save(user);
}

  async remove(id: number) {

    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.delete(id);
  }
}
