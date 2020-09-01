import { hello } from '@/index';

describe('test', () => {
  test('hello', () => {
    expect(hello('Jest')).toEqual('Hello, Jest!');
  });
});
