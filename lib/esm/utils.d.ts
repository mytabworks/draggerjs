export declare const w: Window & typeof globalThis;
export declare const d: Document;
export declare const root: HTMLElement;
export declare type DraggerEventSupportType = 'dragstart' | 'dragmove' | 'dragend' | 'dragenter' | 'dragover' | 'dragexit' | 'drop';
export declare type DraggerOptionProps = {
    axis?: 'x' | 'y';
    draggable?: string;
    droppable?: string;
    allowBoundContainer?: boolean;
    allowExactTargetDraggable?: boolean;
    autoscroll?: boolean;
    autoscrollSensitivity?: number;
    eventListenerOption?: any;
    allowPointerEvent?: boolean;
};
export declare const defaultOptions: DraggerOptionProps;
export declare const requestAnimationFrame: ((callback: FrameRequestCallback) => number) & typeof globalThis.requestAnimationFrame;
export declare const cancelAnimationFrame: ((handle: number) => void) & typeof globalThis.cancelAnimationFrame;
export declare const qs: (selector: string) => Element | null;
export declare const css: (node: HTMLElement, style: Record<string, any>) => void;
export declare const is: {
    str: (a: any) => boolean;
    fnc: (a: any) => boolean;
    node: (a: any) => boolean;
};
export declare const on: (node: HTMLElement, event: string, callback: (event: any) => void, option: any) => void;
export declare const off: (node: HTMLElement, event: string, callback: (event: any) => void, option: any) => void;
export declare const validateType: (_data: any, _types: string[], _error: string) => void;
export declare const validateEvent: (type: string, eventType: string) => void;
export declare type DraggerEventOptionProps = {
    type: DraggerEventSupportType;
    target: HTMLElement;
    container: HTMLElement;
    isDraggableElement: boolean;
    startX: number;
    startY: number;
    moveX: number;
    moveY: number;
    endX: number;
    endY: number;
    clientX: number;
    clientY: number;
    srcDroppable?: HTMLElement | null;
    targetCurrentDroppable?: HTMLElement | null;
    isSameDroppable?: boolean;
    droppableTarget?: HTMLElement | null;
};
export declare class DraggerEvent {
    originalEvent: any;
    constructor(event: any, options: DraggerEventOptionProps);
    preventDefault(): void;
    stopPropagation(): void;
}
export declare const applyCoordinate: (target: HTMLElement, { x, y, axis }: {
    x: number;
    y: number;
    axis?: "x" | "y" | undefined;
}) => void;
declare type GetInitialPositionOptions = {
    container: HTMLElement;
    target: HTMLElement;
    isDraggable: boolean;
};
export declare const getInitialPosition: (event: any, { target, container, isDraggable }: GetInitialPositionOptions) => {
    left: number;
    top: number;
    width: number;
    height: number;
    containerHeight: number;
    containerWidth: number;
};
declare type GetCoordinatesOptions = {
    container: HTMLElement;
    isDraggable?: boolean;
    allowBoundContainer?: boolean;
    initialPosition: any;
};
export declare const getCoordinates: (event: any, { container, isDraggable, initialPosition, allowBoundContainer }: GetCoordinatesOptions) => {
    clientX: number;
    clientY: number;
    x: number;
    y: number;
};
declare type GetDroppableProps = {
    target: HTMLElement;
    droppableQuery: string;
    point: {
        x: number;
        y: number;
    };
};
export declare const getDroppable: ({ target, droppableQuery, point: { x, y } }: GetDroppableProps) => {
    droppableTarget: HTMLElement | null;
    srcDroppable: HTMLElement | null;
    isOverDroppable: boolean | null;
};
declare type AutoScrollAlgorithmProps = {
    y: number;
    x: number;
    clientY: number;
    clientX: number;
    target: HTMLElement;
    container: HTMLElement;
    sensitivity: number;
    initialPosition: ReturnType<typeof getInitialPosition>;
};
export declare const autoScrollAlgorithm: (startDraggingObservables: any, { y, x, clientY, clientX, target, container, sensitivity, initialPosition }: AutoScrollAlgorithmProps) => void;
export {};
