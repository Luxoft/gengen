```ts
interface IFoo {
    prop1: string | undefined;
    prop2: Date | undefined;
}

interface IBar {
    prop1?: string;
    prop2?: Date;
}


// has error (need prop2 to be specified)
const a: IFoo = {
    prop1: 'sd'
}

// has no errors
const b: IBar = {

};
```