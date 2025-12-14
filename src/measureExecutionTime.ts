import { execSync } from 'child_process';
import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { GameType, generateGame } from '.';

// ファイル名：measureExecutionTime.ts

function getCurrentBranch(): string {
  try {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function getNodeVersion(): string {
  return process.version;
}

function formatTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function calculateAverage(values: number[]): number {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

function calculateAverageExcludingOutliers(values: number[]): number {
  if (values.length <= 2) {
    return calculateAverage(values);
  }
  // 最大値と最小値を除外
  const sorted = [...values].sort((a, b) => a - b);
  const excluded = sorted.slice(1, -1);
  return calculateAverage(excluded);
}

function saveToCsv(
  timestamp: string,
  branch: string,
  nodeVersion: string,
  averages: Map<GameType, number>
) {
  try {
    const benchmarkDir = join(process.cwd(), 'benchmark');
    const csvPath = join(benchmarkDir, 'results.csv');

    // benchmark ディレクトリが存在しない場合は作成
    if (!existsSync(benchmarkDir)) {
      mkdirSync(benchmarkDir, { recursive: true });
    }

    // ファイルが存在しない場合はヘッダーを作成
    if (!existsSync(csvPath)) {
      const header = 'timestamp\tbranch\tnode_version\tstandard_avg_ms\tcross_avg_ms\n';
      writeFileSync(csvPath, header, 'utf8');
    }

    // データ行を追記
    const row = `${timestamp}\t${branch}\t${nodeVersion}\t${averages.get('standard')?.toFixed(2)}\t${averages.get('cross')?.toFixed(2)}\n`;
    appendFileSync(csvPath, row, 'utf8');

    console.log('\nSaved to benchmark/results.csv');
  } catch (error) {
    console.error('Error saving to CSV:', error);
  }
}

async function measureExecutionTime() {
  const map = new Map<GameType, number[]>();
  const gameTypes: GameType[] = ['standard', 'cross'];
  map.set('standard', []);
  map.set('cross', []);

  const repeatCount = 10; // 繰り返し回数
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

  // 各実行結果をCSV形式でログ出力
  console.log('\n=== Individual Results ===');
  console.log('standard\tcross');
  for (let i = 0; i < repeatCount; i++) {
    const row = gameTypes.map(gameType => map.get(gameType)![i].toFixed(2)).join('\t');
    console.log(row);
  }

  // 平均値を計算して出力（外れ値を除外）
  console.log('\n=== Average Results (excluding min/max, ms) ===');
  const averages = new Map<GameType, number>();
  gameTypes.forEach(gameType => {
    const values = map.get(gameType)!;
    const avg = calculateAverageExcludingOutliers(values);
    averages.set(gameType, avg);
    console.log(`${gameType}: ${avg.toFixed(2)} (from ${values.length} samples, excluded min/max)`);
  });

  // CSV に保存
  const timestamp = formatTimestamp();
  const branch = getCurrentBranch();
  const nodeVersion = getNodeVersion();
  saveToCsv(timestamp, branch, nodeVersion, averages);
}

measureExecutionTime();
