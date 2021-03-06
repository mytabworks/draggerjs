declare module 'draggerjs';
import { DraggerOptionProps, DraggerEventSupportType, DraggerEvent, DraggerEventOptionProps } from './utils';
export default class Dragger {
    container: HTMLElement;
    options: DraggerOptionProps;
    emitters: Partial<Record<DraggerEventSupportType, (event: DraggerEvent & DraggerEventOptionProps, context: Record<any, any>) => void>>;
    modifiers?: any[];
    pluginDumps: any;
    initHandler?: (event: any) => void;
    static create(...props: [HTMLElement | string, DraggerOptionProps?]): Dragger;
    constructor(container: HTMLElement | string, options?: DraggerOptionProps);
    init(): void;
    on(eventType: DraggerEventSupportType, callback: (event: DraggerEvent & DraggerEventOptionProps, context: Record<any, any>) => void): void;
    off(eventType: DraggerEventSupportType): void;
    destroy(): void;
}
