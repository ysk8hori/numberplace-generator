import Cell from '@/core/entity/cell';
import CellPosition from '@/core/valueobject/cellPosition';
import Height from '@/core/valueobject/height';
import Width from '@/core/valueobject/width';
import AnswerCandidateCollection from '@/core/answerCandidateCollection';
import BaseWidth from '@/core/valueobject/baseWidth';
import BaseHeight from '@/core/valueobject/baseHeight';
import CellCollection from '@/core/cellCollection';
import CellRepository from '@/core/repository/cellRepository';
import GameID from '@/core/valueobject/gameId';
import { autoInjectable, inject } from 'tsyringe';

@autoInjectable()
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
    @inject('CellRepository')
    private cellRepository?: CellRepository,
  ) {}

  public createCells(): CellCollection {
    const cellArray: Cell[] = [];
    for (const pos of CellPosition.generate(
      Width.create(this.baseHeight, this.baseWidth),
      Height.create(this.baseHeight, this.baseWidth),
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
