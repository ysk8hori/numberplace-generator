import CellPosition from '@/core/valueobject/cellPosition';
import VerticalPosition from '@/core/valueobject/verticalPosition';
import Cell from '@/core/entity/cell';
import CellRepository from '@/core/repository/cellRepository';
import { inject, autoInjectable } from 'tsyringe';
import BusinessError from '@/core/businessError';
import RepositoryError from '@/repository/repositoryError';
import GameID from '@/core/valueobject/gameId';
import HorizontalPosition from '@/core/valueobject/horizontalPosition';

@autoInjectable()
export default class Range {
  public static create(gameId: GameID, cellPositions: CellPosition[]): Range {
    return new Range(gameId, cellPositions);
  }
  constructor(
    private gameId: GameID,
    private cellPositions: CellPosition[],
    @inject('CellRepository')
    cellRepository?: CellRepository
  ) {
    this.cellRepository =
      cellRepository ??
      RepositoryError.throwNoRepository(Range.name, 'constructor');
  }

  private cellRepository: CellRepository;

  /**
   * 範囲内のCellを、行ごとに纏めて、上から順番に返す。
   */
  public *fetchRowsInOrder(): Generator<Cell[], void, unknown> {
    const verticalPositions = this.getVerticalPositions();
    for (const verticalPosition of verticalPositions) {
      yield this.getRow(verticalPosition);
    }
  }

  /**
   * 範囲内のCellを、列ごとに纏めて、上から順番に返す。
   */
  public *fetchColsInOrder(): Generator<Cell[], void, unknown> {
    const horizontalPositions = this.getHorizontalPositions();
    for (const horizontalPosition of horizontalPositions) {
      yield this.getCol(horizontalPosition);
    }
  }

  /**
   * 指定した番号の行を返却する
   * @param verticalPosition
   */
  private getRow(verticalPosition: VerticalPosition): Cell[] {
    return this.cellPositions
      .filter(cellPosition =>
        cellPosition.isSameVerticalPosition(verticalPosition)
      )
      .sort((a, b) => a.compareByCol(b))
      .map(pos => this.cellRepository.findByPosition(this.gameId, pos));
  }

  /**
   * 保持するCellの縦位置を返却する
   */
  public getVerticalPositions(): VerticalPosition[] {
    return this.cellPositions
      .map(cellPosition => cellPosition.verticalPosition)
      .reduce((previous, vPos) => {
        if (!previous.find(pos => pos.equals(vPos))) previous.push(vPos);
        return previous;
      }, new Array<VerticalPosition>())
      .sort((a, b) => a.compare(b));
  }

  /**
   * 指定した番号の列を返却する
   * @param horizontalPosition
   */
  private getCol(horizontalPosition: HorizontalPosition): Cell[] {
    return this.cellPositions
      .filter(cellPosition =>
        cellPosition.isSameHorizontalPosition(horizontalPosition)
      )
      .sort((a, b) => a.compareByCol(b))
      .map(pos => this.cellRepository.findByPosition(this.gameId, pos));
  }

  /**
   * 保持するCellの横位置を返却する
   */
  public getHorizontalPositions(): HorizontalPosition[] {
    return this.cellPositions
      .map(cellPosition => cellPosition.horizontalPosition)
      .reduce((previous, hPos) => {
        if (!previous.find(pos => pos.equals(hPos))) previous.push(hPos);
        return previous;
      }, new Array<HorizontalPosition>())
      .sort((a, b) => a.compare(b));
  }

  public toString(): string {
    return JSON.stringify(this.cellPositions, null, '  ');
  }
}
