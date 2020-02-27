import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import Toggle from 'react-toggle'
import "react-toggle/style.css"

import { GlobalContext } from '../../contexts/GlobalContext'

const Settings = ({ showSettings }) => {
  let { setShowSettings, orientation, selectedModel, setSelectedModel, resetCortana, playTts, setPlayTts, shouldDisambig, setShouldDisambig } = useContext(GlobalContext)
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

  function handleTtsChange(event) {
    setPlayTts(event.target.checked)
  }

  function handleDisambigChange(event) {
    setShouldDisambig(event.target.checked)
  }

  return (
    <Container className={ showContainer ? 'showSettings' : '' }>
      <Panel className={ showPanel ? 'showPanel' : '' }>
        <Header>
          <h1>Prototype Settings</h1>
          <CloseButton onClick={ () => setShowSettings(false) }>
            <i className="icon-teams icon-teams-Cancel" />
          </CloseButton>
        </Header>
        <Controls>
          <Control>
            <Label>Select a model</Label>
            <Dropdown
              options={ modelOptions }
              onChange={ (option) => handleModelChange(option) }
              value={ selectedModel } />
          </Control>
          <Control>
            <Label>
              TTS
              <div className="caption">(hybrid and distracted)</div>
            </Label>
            <Toggle
              checked={ playTts }
              onChange={ (event) => handleTtsChange(event) } />
          </Control>
          {/* <Control>
            <Label>
              Disambiguation
            </Label>
            <Toggle
              checked={ shouldDisambig }
              defaultChecked={ shouldDisambig }
              onChange={ (event) => handleDisambigChange(event) } />
          </Control> */}
        </Controls>
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
  background: white;
  color: black;
  display: flex;
  flex-direction: column;

  &.showPanel {
    transform: translateX(0);
  }
`

const Header = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;

  h1 {
    font-size: 24px;
    flex: 1;
    padding-left: 12px;
  }
`

const CloseButton = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Control = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  min-height: 60px;
`

const Label = styled.div`
  flex: 1;

  .caption {
    font-size: 12px;
  }
`

const Orientation = styled.div`
  bottom: 20px;
  padding: 8px 12px 20px 12px;
  font-size: 10px;
`