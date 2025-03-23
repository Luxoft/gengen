import * as fs from 'fs';
import snapshotDiff from 'snapshot-diff';
import { promisify } from 'util';

async function readFile(path: string): Promise<string> {
    const fileData = await promisify(fs.readFile)(path, { encoding: 'utf8' });
    return fileData.replace(/\r?\n|\r/g, '\r');
}

async function main() {
    snapshotter('./.snapshot/all/models.ts', './.output/all/models.ts', 'Models');
    snapshotter('./.snapshot/all/services.ts', './.output/all/services.ts', 'Services without RequestOptions');
    snapshotter('./.snapshot/withRequestOptions/services.ts', './.output/withRequestOptions/services.ts', 'Services with RequestOptions');
    snapshotter(
        './.snapshot/withLegacyUndefineGeneration/models.ts',
        './.output/withLegacyUndefineGeneration/models.ts',
        'Models with LegacyUndefineGeneration'
    );
}

async function snapshotter(pathA: string, pathB: string, name: string) {
    const snapshot = await readFile(pathA);
    const generated = await readFile(pathB);

    console.log(`${name} tests.`);
    console.log(
        snapshotDiff(snapshot, generated, {
            colors: true,
            stablePatchmarks: true,
            aAnnotation: 'Expected',
            bAnnotation: 'Result'
        })
    );
    console.log(`\n`);

    if (snapshot !== generated) {
        console.log(`${name} snapshot tests failed`);
        process.exit(1);
    }
}

main();
