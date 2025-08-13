import { Injectable } from '@nestjs/common';
import { CreateCardInput } from './dto/create-card.input';
import { UpdateCardInput } from './dto/update-card.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}
  create(createCardInput: CreateCardInput) {
    return this.prisma.card.create({ data: createCardInput });
  }

  findAll() {
    return this.prisma.card.findMany();
  }

  findOne(id: string) {
    return this.prisma.card.findUnique({ where: { id } });
  }

  update(id: string, updateCardInput: UpdateCardInput) {
    return this.prisma.card.update({ where: { id }, data: updateCardInput });
  }

  remove(id: string) {
    return this.prisma.card.delete({ where: { id } });
  }
}
