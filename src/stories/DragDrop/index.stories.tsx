import React, { useEffect } from 'react';
import { Parameters } from "@storybook/react"
import Draggerjs from '../../../lib/dist/js'
import './index.scss'

export default {
    title: 'Auto Scroll',
};

const DateTemplate: Parameters = (args) => {
    
   useEffect(() => {
    const dragger = new Draggerjs('#drag-droppable', {
        draggable: '.draggable-box',
        droppable: '.droppable-area',
    })
    dragger.on('dragstart', (e) => {
        const target = e.target
            if(e.isDraggableElement) {
                e.preventDefault() 
                target.classList.add('grabbed')
                target.classList.add('n-float')
                target.classList.remove('n-flat')
            }
        
        })
        dragger.on('dragend', (e) => {
            const target = e.target
            if(e.isDraggableElement) { 
                /*async it to show transition*/
                setTimeout(() => {
                    target.classList.add('n-flat')
                    target.classList.remove('n-float')
                    target.classList.remove('grabbed')
                },0)
            }
        })
        dragger.on('dragenter', (e) => {
            if(e.isDraggableElement && e.target.parentElement !== e.srcDroppable) { 
                e.srcDroppable.classList.add('n-engrave') 
            }
        })
        dragger.on('dragexit', (e) => {
            if(e.isDraggableElement && e.target.parentElement !== e.srcDroppable) { 
                e.srcDroppable.classList.remove('n-engrave') 
            }
        })
        dragger.on('drop', (e) => {
            if(e.isDraggableElement) {
                if(e.target.parentElement !== e.srcDroppable)
                    e.srcDroppable.appendChild(e.target) 
                e.srcDroppable.classList.remove('n-engrave') 
            }
        })

        return () => dragger.destroy()
    }, [])

    return (
        <div className="drag-container" id="drag-droppable">  
            <div className="droppable-area n-no-shadow n-border-color">
                <div className="draggable-box n-no-shadow n-flat">
                    <h1>1</h1>
                </div>
                <div className="draggable-box n-no-shadow n-flat">
                    <h1>2</h1>
                </div>
            </div>
            <div className="droppable-area n-no-shadow n-border-color"></div>
        </div>
    )
};

export const DefaultDate = DateTemplate.bind({});

DefaultDate.args = {
    body: "Successfully show toaster"
}