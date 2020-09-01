import 'reflect-metadata';
import { container } from 'tsyringe';
import CellRepository from '@/core/repository/cellRepository';
import CellRepositoryImpl from '@/repository/cellRepositoryImpl';
import GroupRepository from '@/core/repository/groupRepository';
import GroupRepositoryImpl from '@/repository/groupRepositoryImpl';
import GameRepository from '@/core/repository/gameRepository';
import GameRepositoryImpl from '@/repository/gameRepositoryImpl';

container.register<CellRepository>('CellRepository', {
  useValue: CellRepositoryImpl.create(),
});
container.register<GroupRepository>('GroupRepository', {
  useValue: GroupRepositoryImpl.create(),
});
container.register<GameRepository>('GameRepository', {
  useValue: GameRepositoryImpl.create(),
});
