/// <reference types="vite/client" />
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
declare global {
    type PlainMap<T=any> = {
        [key: string]: T;
    };
}
