import { Factory } from './Factory';
import { ConstructorOf } from './ConstructorOf';

export class Injector {
    private readonly instances = new Map<string, unknown>();
    private readonly factory = new Factory();

    constructor(factoryBuilder: (factory: Factory) => void) {
        factoryBuilder(this.factory);
    }

    public provide<T>(token: ConstructorOf<T>, factory?: (injector: Injector) => T): void {
        this.factory.provide(token, factory);
    }

    public get<T>(token: ConstructorOf<T>): T {
        if (!this.instances.has(token.name)) {
            this.instances.set(token.name, this.factory.create(token, this));
        }

        const instance = this.instances.get(token.name) as T;
        return instance;
    }
}
