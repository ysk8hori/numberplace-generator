import { GameType, generateGame } from '.';

// ファイル名：measureExecutionTime.ts
async function measureExecutionTime() {
  const map = new Map<GameType, number[]>();
  const gameTypes: GameType[] = ['standard', 'cross', 'hyper'];
  map.set('standard', []);
  map.set('cross', []);
  map.set('hyper', []);

  const repeatCount = 5; // 繰り返し回数
  for (let i = 0; i < repeatCount; i++) {
    console.log(`Repeat count: ${i + 1}`);
    for (const gameType of gameTypes) {
      console.log(`GameType: ${gameType}`);
      const startTime = performance.now();
      generateGame({ width: 3, height: 3 }, { gameTypes: [gameType] });
      const endTime = performance.now();
      const time = endTime - startTime;
      map.get(gameType)?.push(time);
    }
  }
  // CSV形式でログ出力
  console.log('standard\tcross\thyper');
  for (let i = 0; i < repeatCount; i++) {
    const row = gameTypes.map(gameType => map.get(gameType)![i]).join('\t');
    console.log(row);
  }
  gameTypes.forEach(gameType => {
    console.log(gameType);
    map.get(gameType)?.forEach(time => console.log(time));
  });
}

measureExecutionTime();
