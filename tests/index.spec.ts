import { hello } from '../src/index';
describe('test', () => {
  test('hello', () => {
    expect(hello('Jest')).toEqual('Hello, Jest!');
  });
});
