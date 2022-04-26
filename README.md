# numberplace-generator

The numberplace-generator provides a function to generate a game of numberplace (Sudoku).

## How to use

Install it.

```shell
npm install @ysk8hori/numberplace-generator
```

Generate a number place game and its answers by doing the following

```typescript
import { generateGame } from '@ysk8hori/numberplace-generator';
// Generate standard 9x9 size number place questions.
const [puzzle, solved] = generateGame({ width: 3, height: 3 });

console.log(pazzle.toString());
/*
9, , , , , ,4, , 
6, , ,4,9,2,3,5, 
2, ,4, ,6,3, ,1,9
 , , , , , ,5,6,2
5, , , , , , ,3, 
 ,3, ,9, , ,7, ,1
7, , , ,5,6, ,9, 
 ,2, ,3, , ,6,7, 
3, , ,7, ,1,2,4, 
*/

console.log(solved.toString());
/*
9,5,3,8,1,7,4,2,6
6,8,1,4,9,2,3,5,7
2,7,4,5,6,3,8,1,9
8,9,7,1,3,4,5,6,2
5,1,2,6,7,8,9,3,4
4,3,6,9,2,5,7,8,1
7,4,8,2,5,6,1,9,3
1,2,5,3,4,9,6,7,8
3,6,9,7,8,1,2,4,5
*/
```

The **block size** of argument is refers to the size of a 3x3 square area for a game that is 9x9 overall. The argument must be an object of { width: number, height: number }.
The length of one side of the game (width multiplied by height) must be 3 or higher, and less than 9. If a larger size is specified, it will take longer to generate the game.
