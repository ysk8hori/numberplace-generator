import Game from '@/core/entity/game';
import BaseHeight from '@/core/valueobject/baseHeight';
import BaseWidth from '@/core/valueobject/baseWidth';
import CellPosition from '@/core/valueobject/cellPosition';
import Answer from '@/core/valueobject/answer';

describe('初級ミニ1', () => {
  let game: Game;
  beforeAll(() => {
    game = Game.create(BaseHeight.create(2), BaseWidth.create(3));
    game.fill(CellPosition.createFromNumber(0, 0), Answer.create('4'));
    game.fill(CellPosition.createFromNumber(5, 0), Answer.create('1'));
    game.fill(CellPosition.createFromNumber(2, 1), Answer.create('2'));
    game.fill(CellPosition.createFromNumber(3, 1), Answer.create('3'));
    game.fill(CellPosition.createFromNumber(1, 2), Answer.create('5'));
    game.fill(CellPosition.createFromNumber(4, 2), Answer.create('3'));
    game.fill(CellPosition.createFromNumber(1, 3), Answer.create('6'));
    game.fill(CellPosition.createFromNumber(4, 3), Answer.create('4'));
    game.fill(CellPosition.createFromNumber(2, 4), Answer.create('5'));
    game.fill(CellPosition.createFromNumber(3, 4), Answer.create('4'));
    game.fill(CellPosition.createFromNumber(0, 5), Answer.create('1'));
    game.fill(CellPosition.createFromNumber(5, 5), Answer.create('5'));
  });
  it('answer for position(1, 0) is 3', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(1, 0))?.value).toEqual(
      '3'
    );
  });
  it('answer for position(2, 0) is 6', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(2, 0))?.value).toEqual(
      '6'
    );
  });
  it('answer for position(3, 0) is 2', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(3, 0))?.value).toEqual(
      '2'
    );
  });
  it('answer for position(4, 0) is 5', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(4, 0))?.value).toEqual(
      '5'
    );
  });
  it('answer for position(0, 1) is 5', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(0, 1))?.value).toEqual(
      '5'
    );
  });
  it('answer for position(1, 1) is 1', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(1, 1))?.value).toEqual(
      '1'
    );
  });
  it('answer for position(4, 1) is 6', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(4, 1))?.value).toEqual(
      '6'
    );
  });
  it('answer for position(5, 1) is 4', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(5, 1))?.value).toEqual(
      '4'
    );
  });
  it('answer for position(0, 2) is 2', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(0, 2))?.value).toEqual(
      '2'
    );
  });
  it('answer for position(1, 2) is 5', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(1, 2))?.value).toEqual(
      '5'
    );
  });
  it('answer for position(2, 2) is 4', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(2, 2))?.value).toEqual(
      '4'
    );
  });
  it('answer for position(3, 2) is 1', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(3, 2))?.value).toEqual(
      '1'
    );
  });
  it('answer for position(4, 2) is 3', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(4, 2))?.value).toEqual(
      '3'
    );
  });
  it('answer for position(5, 2) is 6', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(5, 2))?.value).toEqual(
      '6'
    );
  });
  it('answer for position(0, 3) is 3', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(0, 3))?.value).toEqual(
      '3'
    );
  });
  it('answer for position(1, 3) is 6', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(1, 3))?.value).toEqual(
      '6'
    );
  });
  it('answer for position(2, 3) is 1', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(2, 3))?.value).toEqual(
      '1'
    );
  });
  it('answer for position(3, 3) is 5', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(3, 3))?.value).toEqual(
      '5'
    );
  });
  it('answer for position(4, 3) is 4', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(4, 3))?.value).toEqual(
      '4'
    );
  });
  it('answer for position(5, 3) is 2', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(5, 3))?.value).toEqual(
      '2'
    );
  });
  it('answer for position(0, 4) is 6', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(0, 4))?.value).toEqual(
      '6'
    );
  });
  it('answer for position(1, 4) is 2', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(1, 4))?.value).toEqual(
      '2'
    );
  });
  it('answer for position(2, 4) is 5', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(2, 4))?.value).toEqual(
      '5'
    );
  });
  it('answer for position(3, 4) is 4', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(3, 4))?.value).toEqual(
      '4'
    );
  });
  it('answer for position(4, 4) is 1', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(4, 4))?.value).toEqual(
      '1'
    );
  });
  it('answer for position(5, 4) is 3', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(5, 4))?.value).toEqual(
      '3'
    );
  });
  it('answer for position(0, 5) is 1', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(0, 5))?.value).toEqual(
      '1'
    );
  });
  it('answer for position(1, 5) is 4', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(1, 5))?.value).toEqual(
      '4'
    );
  });
  it('answer for position(2, 5) is 3', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(2, 5))?.value).toEqual(
      '3'
    );
  });
  it('answer for position(3, 5) is 6', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(3, 5))?.value).toEqual(
      '6'
    );
  });
  it('answer for position(4, 5) is 2', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(4, 5))?.value).toEqual(
      '2'
    );
  });
  it('answer for position(5, 5) is 5', () => {
    expect(game.getAnswer(CellPosition.createFromNumber(5, 5))?.value).toEqual(
      '5'
    );
  });
});
