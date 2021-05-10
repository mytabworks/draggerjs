export const w = window;
export const d = document;
export const root = d.documentElement;
export const isSupportPointer = !!root.setPointerCapture;
export const defaultOptions = {
  allowBoundContainer: true,
  allowExactTargetDraggable: false,
  autoscroll: false,
  autoscrollSensitivity: 20,
  eventListenerOption: false
};
export const requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.mozRequestAnimationFrame;
export const cancelAnimationFrame = w.cancelAnimationFrame || w.webkitCancelAnimationFrame || w.mozCancelAnimationFrame;
export const qs = selector => d.querySelector(selector);
export const css = (node, style) => {
  Object.keys(style).forEach(key => {
    if (key in node.style) {
      node.style[key] = style[key];
    }
  });
};
export const is = {
  str: a => typeof a === 'string',
  fnc: a => typeof a === 'function',
  node: a => a && a.nodeType === Node.ELEMENT_NODE
};
export const on = (node, event, callback, option) => {
  event.split(/\s{1,10}/).forEach(eventType => {
    node.addEventListener(eventType, callback, option);
  });
};
export const off = (node, event, callback, option) => {
  event.split(/\s{1,10}/).forEach(eventType => {
    node.removeEventListener(eventType, callback, option);
  });
};
export const validateType = (_data, _types, _error) => {
  if (!(_types.includes(typeof _data) || _types.includes('node') && is.node(_data))) throw new Error(`${_error} must contain the following data types (${_types.map(each => each.toUpperCase()).join(', ')})`);
};
const eventSupported = ['dragstart', 'dragmove', 'dragend', 'dragenter', 'dragover', 'dragexit', 'drop'];
export const validateEvent = (type, eventType) => {
  if (!eventSupported.includes(eventType)) throw new SyntaxError(`Dragger.${type} event type "${eventType}" is not recognize. supported events are ${eventSupported.join(', ')}`);
};
export class DraggerEvent {
  constructor(event, options) {
    Object.assign(this, options);
    this.originalEvent = event;
  }

  preventDefault() {
    this.originalEvent.preventDefault();
  }

  stopPropagation() {
    this.originalEvent.stopPropagation();
  }

}
export const applyCoordinate = (target, {
  x,
  y,
  axis
}) => {
  const position = {
    position: 'absolute'
  };

  if (axis === 'x' || !axis) {
    position.left = `${x}px`;
  }

  if (axis === 'y' || !axis) {
    position.top = `${y}px`;
  }

  css(target, position);
};
export const getInitialPosition = (event, {
  target,
  container,
  isDraggable
}) => {
  const {
    clientX,
    clientY
  } = event.touches && event.touches[0] || event;
  const {
    left = 0,
    top = 0,
    width = 0,
    height = 0
  } = isDraggable ? target.getBoundingClientRect() : {};
  return {
    left: clientX - left,
    top: clientY - top,
    width: width,
    height: height,
    containerHeight: container.scrollHeight,
    containerWidth: container.scrollWidth
  };
};
export const getCoordinates = (event, {
  container,
  isDraggable,
  initialPosition,
  allowBoundContainer
}) => {
  let {
    clientX,
    clientY
  } = event.touches && event.touches[0] || event;
  const bound = container.getBoundingClientRect();
  let x = clientX;
  let y = clientY;

  if (allowBoundContainer) {
    x = getBoundX(container.scrollLeft + (x - bound.left) - (isDraggable ? initialPosition.left : 0), initialPosition);
    y = getBoundY(container.scrollTop + (y - bound.top) - (isDraggable ? initialPosition.top : 0), initialPosition);
  }

  return {
    clientX,
    clientY,
    x,
    y
  };
};
export const getDroppable = ({
  target,
  droppableQuery,
  point: {
    x,
    y
  }
}) => {
  target.hidden = true;
  const droppableTarget = d.elementFromPoint(x, y);
  target.hidden = false;
  const srcDroppable = droppableTarget && droppableTarget.closest(droppableQuery);
  const isOverDroppable = srcDroppable && srcDroppable.matches(droppableQuery);
  return {
    droppableTarget,
    srcDroppable,
    isOverDroppable
  };
};

const getBoundY = (y, initialPosition) => {
  return Math.max(0, Math.min(initialPosition.containerHeight - initialPosition.height, y));
};

const getBoundX = (x, initialPosition) => {
  return Math.max(0, Math.min(initialPosition.containerWidth - initialPosition.width, x));
};

const getAncestorsScrolledTree = container => {
  const ancestors = [];

  for (let elem = container; elem && elem !== d; elem = elem.parentNode) {
    if (elem.scrollHeight > elem.clientHeight || elem.scrollWidth > elem.clientWidth) {
      ancestors.push(elem);
    }
  }

  return ancestors;
};

const getPower = (sensitivity, cut, filler) => Math.min(sensitivity, Math.min(cut, filler > 0 ? filler : cut));

export const autoScrollAlgorithm = (startDraggingObservables, {
  y,
  x,
  clientY,
  clientX,
  target,
  container,
  sensitivity,
  initialPosition
}) => {
  if (startDraggingObservables.animationFrame) {
    cancelAnimationFrame(startDraggingObservables.animationFrame);
  }

  const handleScroll = () => {
    const bound = container.getBoundingClientRect();
    const requestAgain = getAncestorsScrolledTree(container).reduce((result, ancestorEL, _, reduceArray) => {
      const {
        top,
        left
      } = ancestorEL.nodeName !== "HTML" ? ancestorEL.getBoundingClientRect() : {
        top: 0,
        left: 0
      };
      let {
        scrollTop,
        scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth
      } = ancestorEL;
      const position = {};
      const isContainer = ancestorEL === container;
      const topBounds = top + sensitivity;
      const bottomBounds = top + clientHeight - sensitivity;
      const leftBounds = left + sensitivity;
      const rightBounds = left + clientWidth - sensitivity;
      const topSensitivityCut = topBounds - clientY;
      const bottomSensitivityCut = clientY - bottomBounds;
      const leftSensitivityCut = leftBounds - clientX;
      const rightSensitivityCut = clientX - rightBounds;
      const containerY = y + initialPosition.top;
      const containerX = x + initialPosition.left;
      const containerTop = bound.top;
      const containerExceededTop = bound.top + bound.height;
      const containerLeft = bound.left;
      const containerExceededLeft = bound.left + bound.width;
      const isEdgeTopScreen = clientY < topBounds && scrollTop > 0 && (isContainer ? containerY > 0 : clientY > containerTop);
      const isEdgeBottomScreen = clientY > bottomBounds && scrollTop < scrollHeight - clientHeight && (isContainer ? containerY < scrollHeight : clientY < containerExceededTop);
      const isEdgeLeftScreen = clientX < leftBounds && scrollLeft > 0 && (isContainer ? containerX > 0 : clientX > containerLeft);
      const isEdgeRightScreen = clientX > rightBounds && scrollLeft < scrollWidth - clientWidth && (isContainer ? containerX < scrollWidth : clientX < containerExceededLeft);
      const hasEdgeScreen = isEdgeTopScreen || isEdgeBottomScreen || isEdgeLeftScreen || isEdgeRightScreen;

      if (isEdgeTopScreen) {
        const power = getPower(sensitivity, topSensitivityCut, isContainer ? containerY - sensitivity : clientY - containerTop);
        scrollTop -= power;
        y -= power;
        position.top = `${getBoundY(y, initialPosition)}px`;
      } else if (isEdgeBottomScreen) {
        const power = getPower(sensitivity, bottomSensitivityCut, isContainer ? scrollHeight - containerY : containerExceededTop - clientY);
        scrollTop += power;
        y += power;
        position.top = `${getBoundY(y, initialPosition)}px`;
      }

      if (isEdgeLeftScreen) {
        const power = getPower(sensitivity, leftSensitivityCut, isContainer ? containerX - sensitivity : clientX - containerLeft);
        scrollLeft -= power;
        x -= power;
        position.left = `${getBoundX(x, initialPosition)}px`;
      } else if (isEdgeRightScreen) {
        const power = getPower(sensitivity, rightSensitivityCut, isContainer ? scrollWidth - containerX : containerExceededLeft - clientX);
        scrollLeft += power;
        x += power;
        position.left = `${getBoundX(x, initialPosition)}px`;
      }

      if (hasEdgeScreen) {
        ancestorEL.scrollTop = scrollTop;
        ancestorEL.scrollLeft = scrollLeft;
        css(target, position); // stop the reduce iteration

        reduceArray.splice(1);
      }

      return result || hasEdgeScreen;
    }, false);

    if (requestAgain) {
      startDraggingObservables.animationFrame = requestAnimationFrame(handleScroll);
    }
  };

  startDraggingObservables.animationFrame = requestAnimationFrame(handleScroll);
};