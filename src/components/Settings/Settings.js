import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { GlobalContext } from '../../contexts/GlobalContext'

const Settings = ({ showSettings }) => {
  let { setShowSettings, orientation } = useContext(GlobalContext)
  let [ showPanel, setShowPanel ] = useState(false)
  let [ showOverlay, setShowOverlay ] = useState(false)

  useEffect(() => {
    if (showSettings) {
      setShowOverlay(true)
      setTimeout(() => {
        setShowPanel(true)
      }, 250)
    } else {
      setShowPanel(false)
      setTimeout(() => {
        setShowOverlay(false)
      }, 250)
    }
  }, [showSettings])

  return (
    <Container className={ showSettings || showOverlay ? 'showSettings' : '' }>
      <Panel className={ showPanel ? 'showPanel' : '' }>       
        { orientation &&
          <Orientation onClick={() => setShowOrientation(false)}>
            gamma: { orientation.gamma }<br />
            beta: { orientation.beta }<br />
            alpha: { orientation.alpha }
          </Orientation>
        }
      </Panel>
      <Overlay 
        className={ showOverlay ? 'showOverlay' : '' }
        onClick={ () => setShowSettings(false) } />

    </Container>
  )
}

export default Settings

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 0;
  right: -100%;
  top: 0;
  z-index: 9100;

  &.showSettings {
    height: 100%;
    opacity: 1;
    right: 0
  }
`

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  background: rgba(0, 0, 0, 0.8);
  transition: opacity 250ms cubic-bezier(.1, .69, .38, .9);
  z-index: 1;

  &.showOverlay {
    opacity: 1;
  }

`

const Panel = styled.div`
  position: absolute;
  width: 80%;
  height: 100%;
  right: 0;
  top: 0;
  box-shadow: 0px 0.15px 0.45px 0px rgba(0, 0, 0, 0.11), 0px 0.8px 1.8px 0px rgba(0, 0, 0, 0.13);
  transform: translateX(100%);
  transition: transform 250ms cubic-bezier(.1, .69, .38, .9);
  z-index: 10;
  background: #111;

  &.showPanel {
    transform: translateX(0);
  }
`

const Orientation = styled.div`
  color: white;
  bottom: 20px;
  left: 20px;
  font-size: 10px;
`