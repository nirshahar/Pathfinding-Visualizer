export class Wrappable {
    private _wrapper: any;

    unWrap(): void {
        this._wrapper = undefined;
    }

    isWrapped(): boolean {
        return this._wrapper !== undefined;
    }

    setWrapper<K extends Wrapper<any>>(wrapper: K): void {
        this._wrapper = wrapper;
    }

    getWrapper<K extends Wrapper<any>>(): K {
        return this._wrapper;
    }
}

export class Wrapper<T extends Wrappable> {
    wrapped: T;

    constructor(wrapped: T) {
        this.wrapped = wrapped;
        wrapped.setWrapper(this);
    }
}