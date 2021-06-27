import React, { useEffect, useRef } from 'react';
import { Parameters } from "@storybook/react"
import Draggerjs from '../../components'
import { Row, Col } from 'react-bootstrap'
import './index.scss'

export default {
    title: 'Fixed',
};

const DragDrop: Parameters = (args) => {
    const grabbed = useRef<number | null>(null)
    
   useEffect(() => {
    const dragger = new Draggerjs('.select-draggable', {
        draggable: '.draggable-list-row',
        droppable: '.draggable-list',
    })
    dragger.on('dragstart', (event, ctx) => {
        const target = event.target
        if(event.isDraggableElement && !target.matches('[data-facade]')) {
            event.preventDefault()
            ctx.ember?.remove()
            ctx.ember = target.cloneNode(true)
            ctx.ember.classList.add('is-ember')
            target.closest('.draggable-list-body').insertBefore(ctx.ember, target)
            target.style.width = `${target.clientWidth}px`
            target.classList.add('is-grabbed')
        }
    })

    dragger.on('dragend', (event, ctx) => {
        const target = event.target
        if(event.isDraggableElement) {
            target.style.width = null
            target.classList.remove('is-grabbed')
            ctx.ember.remove()
            event.container.querySelector('.is-droppable')?.classList.remove('is-droppable')
        }
    })

    dragger.on('drop', (event) => {
        if(event.isDraggableElement && !event.isSameDroppable) {
            
            const dropInSelection = event.srcDroppable.matches('.selected-droppable')
            alert(grabbed.current)
            event.srcDroppable.classList.remove('is-droppable') 
        }
    })

    dragger.on('dragenter', (e) => {
        if(e.isDraggableElement && e.target.closest('.draggable-list') !== e?.srcDroppable) { 
            e?.srcDroppable.classList.add('is-droppable') 
        } 
    })

    dragger.on('dragexit', (e) => {
        e?.srcDroppable.classList.remove('is-droppable')
    })

        return () => dragger.destroy()
    }, [])

    return (
        <div className="select-draggable"> 
            <Row>
                <Col>
                    <input className="form-control" />                   
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="draggable-list">
                        <div className="draggable-list-header">
                            <div className="draggable-list-title"> Titel </div>
                            <div className="draggable-list-title"> Titel </div>
                            <div className="draggable-list-title"> Titel </div>
                            <div className="draggable-list-title"> Titel </div>
                        </div>
                        <div className="draggable-list-body" onPointerDown={() => grabbed.current = 1}>
                            <div className="draggable-list-row">
                                <div className="draggable-list-data"> sample </div>
                                <div className="draggable-list-data"> sample </div>
                                <div className="draggable-list-data"> sample </div>
                                <div className="draggable-list-data"> sample </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="draggable-list">
                        <div className="draggable-list-header">
                            <div className="draggable-list-title"> Titel </div>
                            <div className="draggable-list-title"> Titel </div>
                            <div className="draggable-list-title"> Titel </div>
                            <div className="draggable-list-title"> Titel </div>
                        </div>
                        <div className="draggable-list-body" onPointerDown={() => grabbed.current = 2}>
                            <div className="draggable-list-row">
                                <div className="draggable-list-data"> sample2 </div>
                                <div className="draggable-list-data"> sample2 </div>
                                <div className="draggable-list-data"> sample2 </div>
                                <div className="draggable-list-data"> sample2 </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row> 
        </div>
    )
};

export const DefaultDragDrop = DragDrop.bind({});