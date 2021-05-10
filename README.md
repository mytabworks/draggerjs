# draggerjs
is a pure vanila javascript without dependency which is use to drag and drop elements in easy and understabdable way.

# installation
```
npm i draggerjs
```
or
```
yarn add draggerjs
```

## import to your project
```js
import Draggerjs from 'draggerjs'
```

# **_Options Props_**

axis?: 'x' | 'y'; - if dragging is specifically only for x or y

draggable?: string; - selector of draggable elements

droppable?: string; - selector of droppable elements

allowBoundContainer?: boolean; - when true the draggable elements will be bound to container

allowExactTargetDraggable?: boolean; - when true the target you hold will be the draggable element

autoscroll?: boolean; - when true it will auto scroll any scrollable container when you drag the element on the edge

autoscrollSensitivity?: number; - the sensitivity of the edge scrolling; default 20

eventListenerOption?: any - the option of the addEventListener and removeEventListener


# **_Methods_**

destroy() - to destroy the event listner use in draggerjs

# _**Usage**_

JAVASCRIPT
```js
const dragger = new Draggerjs('#drag-autoscroll', {
    draggable: '.draggable-box',
    autoscroll: true
})

dragger.on('dragstart', (e) => { 
    const target = e.target
    if(e.isDraggableElement) {
        // prevent mobile from scrolling
        // when dragging draggable element
        e.preventDefault()
        target.classList.add('grabbed')
        if(target.classList.contains('center')) {
            target.classList.remove('center')
        }
    }
})

dragger.on('dragend', (e) => {
    if(e.isDraggableElement) {  
        e.target.classList.remove('grabbed') 
    }
})

if('removeDraggerListener' === true) {
    dragger.destroy()
}

```

CSS
```css
.drag-container {  
    display: flex;
    flex-wrap: wrap;
    height: 250px;  
    position: relative;
}
.drag-long-ground {
    display: block;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
.drag-long-ground > .drag-around {
    width: 1250px;
    height: 1250px;
}
.drag-container > .drag-around {
    flex: 1 1;
    width: 100%; 
    border: 2px dashed #fff;
    border-radius: 15px;
    padding: 15px;
    transition: box-shadow 300ms ease-in;
}
.drag-container .draggable-box {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 50px;
    min-height: 50px;
    padding: 0 10px; 
    border-radius: 10px;
    transition: box-shadow 300ms ease-in;
    cursor: grab;
}
.drag-container .draggable-box > h1 { 
    margin-bottom: 5px;
}
.drag-container .grabbed {
    cursor: grabbing;
    margin: 0;
}
.draggable-box.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

HTML
```html
<div class="drag-container drag-long-ground" id="drag-autoscroll">  
    <div class="drag-around n-border-color">
        <div class="draggable-box center n-flat">
            <h1>Drag Me</h1>
        </div> 
    </div>
</div>
```