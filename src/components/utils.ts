export const w = window
export const d = document
export const root = d.documentElement
export const isSupportPointer = !!root.setPointerCapture
export type DraggerEventSupportType = 'dragstart' | 'dragmove' | 'dragend' | 'dragenter' | 'dragover' | 'dragexit' | 'drop'

export type DraggerOptionProps = {
    axis?: 'x' | 'y';
    draggable?: string; 
    droppable?: string;
    allowBoundContainer?: boolean;
    allowExactTargetDraggable?: boolean;
    autoscroll?: boolean;
    autoscrollSensitivity?: number;
    eventListenerOption?: any
}

export const defaultOptions: DraggerOptionProps = {
    allowBoundContainer: true,
    allowExactTargetDraggable: false,
    autoscroll: false,
    autoscrollSensitivity: 20,
    eventListenerOption: false
};


export const requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || (w as any).mozRequestAnimationFrame;

export const cancelAnimationFrame = w.cancelAnimationFrame || w.webkitCancelAnimationFrame || (w as any).mozCancelAnimationFrame;

export const qs = (selector: string) => d.querySelector(selector) 

export const css = (node: HTMLElement, style: Record<string, any>) => {
    Object.keys(style).forEach(key => {
        if(key in node.style) {
            node.style[key] = style[key]
        }
    })
}

export const is = {
    str: (a: any) => typeof a === 'string',
    fnc: (a: any) => typeof a === 'function',
    node: (a: any) => a && a.nodeType === Node.ELEMENT_NODE
}

export const on = (node: HTMLElement, event: string, callback: (event: any) => void, option: any) => {
    event.split(/\s{1,10}/).forEach((eventType) => {
        node.addEventListener(eventType, callback, option)
    })
}

export const off = (node: HTMLElement, event: string, callback: (event: any) => void, option: any) => {
    event.split(/\s{1,10}/).forEach((eventType) => {
        node.removeEventListener(eventType, callback, option)
    })
}

export const validateType = (_data: any, _types: string[], _error: string) => {
    if(!(_types.includes(typeof(_data))
         || (_types.includes('node') && is.node(_data))))
      throw new Error(`${_error} must contain the following data types (${_types.map((each) => each.toUpperCase()).join(', ')})`)
}

const eventSupported = ['dragstart', 'dragmove', 'dragend', 'dragenter', 'dragover', 'dragexit', 'drop']

export const validateEvent = (type: string, eventType: string) => {
    if (!eventSupported.includes(eventType))
        throw new SyntaxError(
            `Dragger.${type} event type "${eventType}" is not recognize. supported events are ${eventSupported.join(
                ', '
            )}`
        );
}

export type DraggerEventOptionProps = {
    type: DraggerEventSupportType,
    target: HTMLElement,
    container: HTMLElement,
    isDraggableElement: boolean,
    startX: number,
    startY: number,
    moveX: number,
    moveY: number,
    endX: number,
    endY: number,
    clientX: number,
    clientY: number,
    srcDropable?: HTMLElement | null;
    droppableTarget?: HTMLElement | null; 
};

export class DraggerEvent {
    originalEvent: any;
    constructor(event: any, options: DraggerEventOptionProps){
         Object.assign(this, options)
         this.originalEvent = event
    }
    preventDefault() { this.originalEvent.preventDefault() }
    stopPropagation() { this.originalEvent.stopPropagation() }
}

export const applyCoordinate = (target: HTMLElement, { x, y, axis }: {
    x: number, 
    y: number, 
    axis?: 'x' | 'y'
}) => {
    const position: any = {
        position: 'absolute'
    }
    if(axis === 'x' || !axis) {
        position.left = `${x}px`
    }
    if(axis === 'y' || !axis)  {
        position.top = `${y}px`
    }
    css(target, position);
}

type GetInitialPositionOptions = {
    container: HTMLElement;
    target: HTMLElement;
    isDraggable: boolean;
}

export const getInitialPosition = (event: any, {
    target,
    container, 
    isDraggable
}: GetInitialPositionOptions) => {
    const { clientX, clientY } = (event.touches && event.touches[0]) || event 
    const { left = 0, top = 0, width = 0, height = 0 } = isDraggable ? target.getBoundingClientRect() : {}
    return { 
        left: clientX - left,
        top: clientY - top,
        width: width,
        height: height,
        containerHeight: container.scrollHeight,
        containerWidth: container.scrollWidth,
    }
    
}

type GetCoordinatesOptions = {
    container: HTMLElement;
    isDraggable?: boolean;
    allowBoundContainer?: boolean;
    initialPosition: any;
}

export const getCoordinates = (event: any, { 
    container,
    isDraggable, 
    initialPosition, 
    allowBoundContainer 
}: GetCoordinatesOptions) => { 
    let { clientX, clientY }: { clientX: number, clientY: number } = (event.touches && event.touches[0]) || event 
    const bound = container.getBoundingClientRect() 
    let x = clientX
    let y = clientY
    if(allowBoundContainer) {
        x = getBoundX(container.scrollLeft + (x - bound.left) - (isDraggable ? initialPosition.left : 0), initialPosition)
        y = getBoundY(container.scrollTop + (y - bound.top) - (isDraggable ? initialPosition.top : 0), initialPosition)
    }
    return {
        clientX,
        clientY,
        x,
        y,
    }
}

type GetDroppableProps = {
    target: HTMLElement;
    droppableQuery: string;
    point: {
        x: number;
        y: number;
    }
}

export const getDroppable = ({target, droppableQuery, point: { x, y} }: GetDroppableProps) => {
    target.hidden = true
    const droppableTarget = d.elementFromPoint(x, y) as HTMLElement | null
    target.hidden = false
    const srcDropable: HTMLElement | null = droppableTarget && droppableTarget.closest(droppableQuery)
    const isOverDroppable = srcDropable && srcDropable.matches(droppableQuery)
    return {
        droppableTarget,
        srcDropable,
        isOverDroppable
    }
}

const getBoundY = (y: number, initialPosition: any) => { 
    return Math.max(0, Math.min(initialPosition.containerHeight - initialPosition.height, y))
}

const getBoundX = (x: number, initialPosition: any) => {  
    return Math.max(0, Math.min(initialPosition.containerWidth - initialPosition.width, x))
}

const getAncestorsScrolledTree = (container: HTMLElement) => {
    const ancestors = []
    for (let elem: any = container; elem && elem !== d; elem = elem.parentNode ) {
        if(elem.scrollHeight > elem.clientHeight || elem.scrollWidth > elem.clientWidth) {
            ancestors.push(elem);
        }
    }
    return ancestors 
}

const getPower = (sensitivity: number, cut: number, filler: number) => Math.min(sensitivity, Math.min(cut, filler > 0 ? filler : cut))

type AutoScrollAlgorithmProps = {
    y: number,
    x: number,
    clientY: number,
    clientX: number,
    target: HTMLElement,
    container: HTMLElement,
    sensitivity: number,
    initialPosition: ReturnType<typeof getInitialPosition>
}

export const autoScrollAlgorithm = (startDraggingObservables: any, {
    y,
    x,
    clientY,
    clientX,
    target,
    container,
    sensitivity,
    initialPosition
}: AutoScrollAlgorithmProps) => {
    
    if(startDraggingObservables.animationFrame) {
        cancelAnimationFrame(startDraggingObservables.animationFrame);
    }

    const handleScroll = () => {
        const bound = container.getBoundingClientRect()
        const requestAgain = getAncestorsScrolledTree(container).reduce((result, ancestorEL, _, reduceArray) => {
            const { top, left } = ancestorEL.nodeName !== "HTML" ? ancestorEL.getBoundingClientRect() : {
                top: 0,
                left: 0 
            }
            let { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = ancestorEL 
            const position: Record<string, any> = {} 
            const isContainer = ancestorEL === container 
            const topBounds = top + sensitivity!
            const bottomBounds = top + clientHeight - sensitivity!
            const leftBounds = left + sensitivity!
            const rightBounds = left + clientWidth - sensitivity!
            const topSensitivityCut = topBounds - clientY
            const bottomSensitivityCut = clientY - bottomBounds
            const leftSensitivityCut = leftBounds - clientX
            const rightSensitivityCut = clientX - rightBounds
            const containerY = y + initialPosition.top
            const containerX = x + initialPosition.left
            const containerTop = bound.top
            const containerExceededTop = bound.top + bound.height
            const containerLeft = bound.left
            const containerExceededLeft = bound.left + bound.width
            const isEdgeTopScreen = 
                clientY < topBounds
                && scrollTop > 0
                && (isContainer ? containerY > 0 : clientY > containerTop)
            const isEdgeBottomScreen =
                clientY > bottomBounds  
                && scrollTop < scrollHeight - clientHeight
                && (isContainer ? containerY < scrollHeight : clientY < containerExceededTop);
            const isEdgeLeftScreen =
                clientX < leftBounds 
                && scrollLeft > 0
                && (isContainer ? containerX > 0 : clientX > containerLeft)
            const isEdgeRightScreen = 
                clientX > rightBounds
                && scrollLeft < scrollWidth - clientWidth
                && (isContainer ? containerX < scrollWidth : clientX < containerExceededLeft);
            const hasEdgeScreen = isEdgeTopScreen || isEdgeBottomScreen || isEdgeLeftScreen || isEdgeRightScreen
            
            if (isEdgeTopScreen) { 
                const power = getPower(sensitivity!, topSensitivityCut, isContainer ? containerY - sensitivity! : clientY - containerTop)
                scrollTop -= power;
                y -= power 
                position.top = `${getBoundY(y, initialPosition)}px`
            } else if (isEdgeBottomScreen) { 
                const power = getPower(sensitivity!, bottomSensitivityCut, isContainer ? scrollHeight - containerY : containerExceededTop - clientY)
                scrollTop += power;
                y += power 
                position.top = `${getBoundY(y, initialPosition)}px` 
            }
            if (isEdgeLeftScreen) {
                const power = getPower(sensitivity!, leftSensitivityCut, isContainer ? containerX - sensitivity! : clientX - containerLeft)
                scrollLeft -= power;
                x -= power 
                position.left = `${getBoundX(x, initialPosition)}px`
            } else if (isEdgeRightScreen) { 
                const power = getPower(sensitivity!, rightSensitivityCut, isContainer ? scrollWidth - containerX : containerExceededLeft - clientX)
                scrollLeft += power
                x += power
                position.left = `${getBoundX(x, initialPosition)}px` 
            }

            if(hasEdgeScreen) {
                ancestorEL.scrollTop = scrollTop
                ancestorEL.scrollLeft = scrollLeft
                css(target, position)
                // stop the reduce iteration
                reduceArray.splice(1)
            }

            return result || hasEdgeScreen
        }, false) 

        if(requestAgain) {
            startDraggingObservables.animationFrame = requestAnimationFrame(handleScroll)
        }
    }

    startDraggingObservables.animationFrame = requestAnimationFrame(handleScroll);

}