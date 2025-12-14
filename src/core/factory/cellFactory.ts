import Cell from '@/core/entity/cell';
import CellPosition from '@/core/valueobject/cellPosition';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import BaseWidth from '@/core/valueobject/baseWidth';
import BaseHeight from '@/core/valueobject/baseHeight';
import CellCollection from '@/core/cellCollection';
import CellRepository from '@/core/repository/cellRepository';
import GameID from '@/core/valueobject/gameId';
import { container } from 'tsyringe';

export default class CellFactory {
  public static create(
    gameId: GameID,
    baseHeight: BaseHeight,
    baseWidth: BaseWidth,
    answerCandidateCollectionOrg: AnswerCandidateCollection,
  ): CellFactory {
    return new CellFactory(
      gameId,
      baseHeight,
      baseWidth,
      answerCandidateCollectionOrg,
    );
  }

  constructor(
    private gameId: GameID,
    private baseHeight: BaseHeight,
    private baseWidth: BaseWidth,
    private answerCandidateCollectionOrg: AnswerCandidateCollection,
    private cellRepository: CellRepository = container.resolve(
      'CellRepository',
    ),
  ) {}

  public createCells(): CellCollection {
    const cellArray: Cell[] = [];
    for (const pos of CellPosition.generate(
      this.baseHeight.value * this.baseWidth.value,
      this.baseHeight.value * this.baseWidth.value,
    )) {
      cellArray.push(
        Cell.create(
          this.gameId,
          pos,
          this.answerCandidateCollectionOrg.clone(),
        ),
      );
    }
    const collection = CellCollection.create(cellArray);
    this.cellRepository!.regist(this.gameId, collection);
    return collection;
  }
}
