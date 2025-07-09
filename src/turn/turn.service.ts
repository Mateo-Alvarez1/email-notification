import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateTurnDto } from "./dto/create-turn.dto";
import { UpdateTurnDto } from "./dto/update-turn.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Turn } from "./entities/turn.entity";
import { Repository } from "typeorm";
import { validate as IsUUID } from "uuid";

@Injectable()
export class TurnService {
  constructor(
    @InjectRepository(Turn)
    private readonly turnRepository: Repository<Turn>
  ) {}

  async create(createTurnDto: CreateTurnDto) {
    try {
      const turn = this.turnRepository.create(createTurnDto);
      await this.turnRepository.save(turn);
      return turn;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll() {
    return this.turnRepository.find();
  }

  async findOne(term: string) {
    let turn: Turn | null;

    if (IsUUID(term)) {
      turn = await this.turnRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.turnRepository.createQueryBuilder();
      turn = await queryBuilder
        .where(`name =:name`, {
          name: term,
        })
        .getOne();
    }

    if (!turn) {
      throw new NotFoundException(`turn with ${term} not found`);
    }

    return turn;
  }

  async update(id: string, updateturnDto: UpdateTurnDto) {
    try {
      const turn = await this.turnRepository.preload({
        id: id,
        ...updateturnDto,
      });

      if (!turn) {
        throw new BadRequestException(
          `Turn Whit id ${id} not found in database`
        );
      }

      await this.turnRepository.save(turn);
      return turn;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string) {
    const { affected } = await this.turnRepository.delete({ id });
    if (affected === 0)
      throw new BadRequestException(
        `Not found turn whit ${id} in the database`
      );

    return;
  }

  private handleErrors(error: any) {
    if (error.code === "23505") throw new BadRequestException(error.detail);
    throw new InternalServerErrorException("Unexpected problem , check logs");
  }
}
