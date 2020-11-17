import * as fs from 'fs';
import { promisify } from 'util';
import snapshotDiff from 'snapshot-diff';

function readFile(path: string) {
    return promisify(fs.readFile)(path, { encoding: 'utf8' });
}

async function main() {
    snapshotter('./.snapshot/selected/services.ts', './.output/selected/services.ts', 'Services');
    snapshotter('./.snapshot/selected/models.ts', './.output/selected/models.ts', 'Models');
    snapshotter('./.snapshot/all/services.ts', './.output/all/services.ts', 'Services');
    snapshotter('./.snapshot/all/models.ts', './.output/all/models.ts', 'Models');
}

async function snapshotter(pathA: string, pathB: string, name: string) {
    const snapshot = await readFile(pathA);
    const generated = await readFile(pathB);
    console.log(snapshotDiff(snapshot, generated, { colors: true }));

    if (snapshot !== generated) {
        console.log(`${name} snapshot tests failed`);
        process.exit(1);
    }
}

main();