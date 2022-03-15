import { Constructor, ConstructorOf } from './ConstructorOf';
import { Injector } from './Injector';

export class Factory {
    private map = new Map<string, (injector: Injector) => unknown>();

    public provide<T>(token: ConstructorOf<T>, factory?: (injector: Injector) => T): this {
        this.map.set(token.name, factory ? factory : this.getDefaultFactory(token));
        return this;
    }

    public create<T>(token: ConstructorOf<T>, injector: Injector): T {
        if (!this.map.has(token.name)) {
            throw new Error(`No provider found for ${token.name}`);
        }

        const factory = this.map.get(token.name) as (Injector: Injector) => T;
        return factory(injector);
    }

    private getDefaultFactory<T>(token: ConstructorOf<T>): () => T {
        const ctor = token as Constructor<T>;
        return () => new ctor();
    }
}
