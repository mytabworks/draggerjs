import {
	d,
	isSupportPointer,
    defaultOptions,
    DraggerOptionProps,
    DraggerEventSupportType,
	is,
	qs,
	css,
	applyCoordinate,
	on,
	off,
	getCoordinates,
	getDroppable,
	validateType,
	validateEvent,
	DraggerEvent,
    getInitialPosition,
    DraggerEventOptionProps,
    autoScrollAlgorithm
} from './utils';

export default class Dragger {
	container: HTMLElement;
	options: DraggerOptionProps;
	emitters: Partial<Record<DraggerEventSupportType, (event: DraggerEvent & DraggerEventOptionProps) => void>> = {};
	modifiers?: any[];
    pluginDumps: any;
    initHandler?: (event: any) => void;

	static create(...props: [HTMLElement | string, DraggerOptionProps?]) {
		return new Dragger(...props);
	}

	constructor(container: HTMLElement | string, options?: DraggerOptionProps) {
        
		this.container = is.str(container)
			? qs(container as string) as HTMLElement
			: is.node(container)
                ? container as HTMLElement
                : d.body;
		this.options = { ...defaultOptions, ...options };
		Object.keys(this.options).forEach((key) => {
			validateType(this.options[key], 
				[ key === 'autoscrollSensitivity' 
				? 'number' 
				: ['droppable', 'draggable', 'axis'].includes(key) 
					? 'string' 
					:  'boolean'
				], 
				`Dragger options \`${key}\``)
		})
		validateType(container, ['string', 'node'], 'Dragger argument `0`')
		validateType(this.container, ['node'], 'Dragger this.container is null check carefully what you input in argument `0`')
		this.init();
	}

	init() {
		const container = this.container;
		const { 
            axis, 
            draggable: draggableQuery, 
            droppable: droppableQuery, 
            allowBoundContainer, 
            allowExactTargetDraggable, 
            autoscroll, 
            autoscrollSensitivity, 
            eventListenerOption 
		} = this.options;

		/*DRAG-START*/
		this.initHandler = (startEvent: any) => {
			const startDraggingObservables: {
				droppableAt?: HTMLElement | null;
				animationFrame?: any;
			} = {} 

			const {
				dragstart,
				dragmove,
				dragend,
				dragenter,
				dragover,
				dragexit,
				drop,
			} = this.emitters;
			const target: HTMLElement = (!allowExactTargetDraggable && startEvent.target.closest(draggableQuery)) || startEvent.target;
            const isDraggable = !!draggableQuery && target.matches(draggableQuery);
            const initialPosition = getInitialPosition(startEvent, {
                target,
                container,
                isDraggable
            })
			const getCoordinatesOptions = { 
                container, 
                isDraggable, 
                allowBoundContainer,
                initialPosition: initialPosition
            };

            const { x: startX, y: startY, ...startC } = getCoordinates(startEvent, getCoordinatesOptions)
            
			const draggerEvent: DraggerEventOptionProps = {
				type: 'dragstart',
				target,
				container,
				isDraggableElement: isDraggable,
				startX: startX,
				startY: startY,
				moveX: startX,
				moveY: startY,
				endX: startX,
				endY: startY,
				clientX: startC.clientX,
				clientY: startC.clientY,
            }

			if(is.fnc(dragstart)) {
                //@ts-ignore
                 dragstart!.call(container, new DraggerEvent(startEvent, draggerEvent))
            }

			if(isDraggable) {
                applyCoordinate(target, {
                    x: startX, 
                    y: startY, 
                    axis
                })
			}
			
			if(isSupportPointer) {
				target.setPointerCapture(startEvent.pointerId)
			}
			
			/*DRAG-MOVE*/
			const moveHandler = (moveEvent: any) => {
				const {clientX, clientY, ...moveC} = getCoordinates(moveEvent, getCoordinatesOptions);
				draggerEvent.clientX = clientX;
				draggerEvent.clientY = clientY;
				let x = (draggerEvent.moveX = draggerEvent.endX = moveC.x);
				let y = (draggerEvent.moveY = draggerEvent.endY = moveC.y);
				if (isDraggable) {
                    applyCoordinate(target, {
                        x, 
                        y, 
                        axis
                    })

					if(autoscroll) {
                        autoScrollAlgorithm(startDraggingObservables, {
                            target,
                            container,
                            x,
                            y,
                            clientX,
                            clientY,
                            sensitivity: autoscrollSensitivity!,
                            initialPosition
                        })
					}
                    
					if (droppableQuery) {

						const {
							srcDroppable,
							droppableTarget,
							isOverDroppable,
						} = getDroppable({
							target,
							droppableQuery,
							point: {
								x: draggerEvent.clientX,
								y: draggerEvent.clientY,
							},
                        });
                        
						if (isOverDroppable) {
							if (startDraggingObservables.droppableAt !== srcDroppable) {
								if(is.fnc(dragenter)) {
                                    // @ts-ignore
									dragenter!.call(srcDroppable, new DraggerEvent(moveEvent, {
										...draggerEvent,
										type: 'dragenter',
										srcDroppable,
										droppableTarget,
                                    }));
                                }
                                
                                if(startDraggingObservables.droppableAt && is.fnc(dragexit)) {
                                    // @ts-ignore
									dragexit!.call(srcDroppable, new DraggerEvent(moveEvent, {
										...draggerEvent,
										type: 'dragexit',
										srcDroppable: startDraggingObservables.droppableAt,
                                    }));
                                }
                            }
                            
                            startDraggingObservables.droppableAt = srcDroppable;
                            
							if(is.fnc(dragover)) {
                                // @ts-ignore
								dragover!.call(container, new DraggerEvent(moveEvent, {
									...draggerEvent, 
									type: 'dragover',
									srcDroppable,
									droppableTarget,
                                }))
                            }
						}
					}
                }

                if(is.fnc(dragmove)) {
                    // @ts-ignore
                    dragmove!.call(container, new DraggerEvent(moveEvent, {
                        ...draggerEvent, 
                        type: 'dragmove'
                    }));
                }
			};

			on(container, isSupportPointer ? 'pointermove' : 'mousemove touchmove', moveHandler, eventListenerOption);

			/*DRAG-END*/
			const endHandler = (endEvent: any) => {

				if(autoscroll && startDraggingObservables.animationFrame) {
					cancelAnimationFrame(startDraggingObservables.animationFrame)
				}

				if (droppableQuery && isDraggable) {
					if (isDraggable) {
						css(target, {
							position: null,
							left: null,
							top: null,
						});
                    }
                    
					const {
						srcDroppable,
						droppableTarget,
						isOverDroppable,
					} = getDroppable({
						target,
						droppableQuery,
						point: {
							x: draggerEvent.clientX,
							y: draggerEvent.clientY,
						},
					});
					
                    if(isOverDroppable && is.fnc(drop)) {
                        // @ts-ignore
                        drop!.call(srcDroppable, new DraggerEvent(endEvent, {
                            ...draggerEvent,
                            type: 'drop',
                            srcDroppable,
                            droppableTarget,
                        }))
                    }
				}
				
				if(is.fnc(dragend)) {
                    // @ts-ignore
                    dragend!.call(container, new DraggerEvent(endEvent, {
                        ...draggerEvent, 
                        type: 'dragend'
                    }));
				}
				
				if(isSupportPointer) {
					target.releasePointerCapture(endEvent.pointerId)
				}
					
				off(container, isSupportPointer ? 'pointermove' : 'mousemove touchmove', moveHandler, eventListenerOption);
				off(container, isSupportPointer ? 'pointerup' : 'mouseup touchend', endHandler, eventListenerOption);
			};

			on(container, isSupportPointer ? 'pointerup' : 'mouseup touchend', endHandler, eventListenerOption);
		};
		on(container, isSupportPointer ? 'pointerdown' : 'mousedown touchstart', this.initHandler, eventListenerOption);
	}

	on(eventType: DraggerEventSupportType, callback: (event: DraggerEvent & DraggerEventOptionProps) => void) {
		validateEvent('on', eventType)
		this.emitters[eventType] = callback;
	}

	off(eventType: DraggerEventSupportType) {
		validateEvent('off', eventType)
		delete this.emitters[eventType];
	}

	destroy() {
		off(this.container, isSupportPointer ? 'pointerdown' : 'mousedown touchstart', this.initHandler!, this.options.eventListenerOption);
	}
}