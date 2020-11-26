import { Project } from 'ts-morph';

import { ConfigGenerator } from './generators/ConfigGenerator';
import { configOptions, defaultOptions, generatorsOptions, IOptions } from './options';

export default async function init(options: IOptions = defaultOptions): Promise<void> {
    const generator = new ConfigGenerator();
    const project = new Project(generatorsOptions);

    project.createSourceFile(
        `${options.configOutput}/${configOptions.filename}`,
        { statements: generator.getConfigCodeStructure() },
        { overwrite: true }
    );

    await project.save();
}
