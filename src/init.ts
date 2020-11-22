import { Project } from 'ts-morph';

import { ConfigMorphService } from './morph/ConfigMorphService';
import { configOptions, defaultOptions, IOptions, morphOptions } from './options';

export default async function init(options: IOptions = defaultOptions): Promise<void> {
    const morphService = new ConfigMorphService();
    const project = new Project(morphOptions);

    project.createSourceFile(
        `${options.configOutput}/${configOptions.filename}`,
        { statements: morphService.getConfigStatements() },
        { overwrite: true }
    );

    await project.save();
}
