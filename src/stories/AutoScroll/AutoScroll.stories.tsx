import React, { useEffect } from 'react';
import { Parameters } from "@storybook/react"
import Draggerjs from '../../components'
import './index.scss'

export default {
    title: 'Auto Scroll',
};

const DateTemplate: Parameters = (args) => {
    
   useEffect(() => {
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

        return () => dragger.destroy()
    }, [])

    return (
        <div className="drag-container drag-long-ground" id="drag-autoscroll">  
            <div className="drag-around n-border-color">
                <div className="draggable-box center n-flat">
                    <h1>Drag Me</h1>
                </div> 
            </div>
        </div>
        )
};

export const DefaultDate = DateTemplate.bind({});

DefaultDate.args = {
    body: "Successfully show toaster"
}