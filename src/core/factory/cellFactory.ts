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

export function createCells({
  gameId,
  baseHeight,
  baseWidth,
  answerCandidateCollection: answerCandidateCollectionOrg,
  cellRepository,
}: {
  gameId: GameID;
  baseHeight: BaseHeight;
  baseWidth: BaseWidth;
  answerCandidateCollection: AnswerCandidateCollection;
  cellRepository: CellRepository;
}) {
  const cellArray: Cell[] = [];
  for (const pos of CellPosition.generate(
    Width.create(baseHeight, baseWidth),
    Height.create(baseHeight, baseWidth),
  )) {
    cellArray.push(
      Cell.create(gameId, pos, answerCandidateCollectionOrg.clone()),
    );
  }
  const collection = CellCollection.create(cellArray);
  cellRepository!.regist(gameId, collection);
  return collection;
}
