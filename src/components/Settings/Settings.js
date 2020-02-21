import React, { useContext, useState, useEffect } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import styled from 'styled-components'
import { GlobalContext } from '../../contexts/GlobalContext'

const Settings = ({ showSettings }) => {
  let { setShowSettings, orientation, selectedModel, setSelectedModel, resetCortana } = useContext(GlobalContext)
  let [ showContainer, setShowContainer ] = useState(false)
  let [ showPanel, setShowPanel ] = useState(false)
  let [ showOverlay, setShowOverlay ] = useState(false)
  const modelOptions = [ 'distracted', 'full attention', 'hybrid' ]

  useEffect(() => {
    if (showSettings) {
      setShowContainer(true)
      setShowOverlay(true)
      setTimeout(() => {
        setShowPanel(true)
      }, 250)
    } else {
      setShowPanel(false)
      setTimeout(() => {
        setShowOverlay(false)
        setTimeout(() => {
          setShowContainer(false)
        }, 250)
      }, 250)
    }
  }, [showSettings])

  function handleModelChange(option) {
    console.log(option.value)
    setSelectedModel(option.value)
    resetCortana()
  }

  return (
    <Container className={ showContainer ? 'showSettings' : '' }>
      <Panel className={ showPanel ? 'showPanel' : '' }>
        <Control>
          <Label>Select a model</Label>
          <Dropdown
            options={ modelOptions }
            onChange={ (option) => handleModelChange(option) }
            value={ selectedModel } />
        </Control>
        { orientation &&
          <Orientation>
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

const Control = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
`

const Label = styled.div`
  flex: 1;
  color: white;
`

const Orientation = styled.div`
  color: white;
  bottom: 20px;
  padding: 8px;
  font-size: 10px;
`