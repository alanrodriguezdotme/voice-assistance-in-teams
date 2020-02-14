import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import SpeechRecognition from 'react-speech-recognition'

import { GlobalContext } from '../../contexts/GlobalContext'
import VoiceMeter from './VoiceMeter'
import { SpeechToTextContext } from '../../contexts/SpeechToTextContext'
// import { BrowserSTTContext } from '../../contexts/BrowserSTTContext'

const options = {
  autoStart: false,
  continuous: false
}

const CortanaPanel = ({
  resetTranscript,
  startListening,
  stopListening,
  listening,
  interimTranscript,
  finalTranscript,
  browserSupportsSpeechRecognition }) => {
  let { showCortanaPanel, setShowCortanaPanel, utterance, sttState, luisResponse, resetCortana } = useContext(GlobalContext)
  let { recognizerStop } = useContext(SpeechToTextContext)
  // const { sttStop } = useContext(BrowserSTTContext)
  let [ showOverlay, setShowOverlay ] = useState(false)
  let [ showPanel, setShowPanel ] = useState(false)

  // useEffect(() => {
  //   console.log({
  //     interimTranscript,
  //     finalTranscript,
  //     listening
  //   })
  // }, [listening])

  // handle timing of transitions
  useEffect(() => {
    if (showCortanaPanel) {
      setShowOverlay(true)
      setTimeout(() => {
        setShowPanel(true)
        // startListening()
      }, 350)
    } else {
      setShowPanel(false)
      setTimeout(() => {
        setShowOverlay(false)
      }, 350)
    }
  }, [showCortanaPanel])

  function renderCortanaText () {
    if (!luisResponse) {
      return "How can I help you?"
    } else {
      return "I'm on it..."
    }
  }

  function handleOverlayClick() {
    recognizerStop()
    // sttStop()
    // stopListening()
    resetCortana()
  }

  return (
    <Container className={ showOverlay ? 'showOverlay' : '' }>
      <Overlay className={ showOverlay ? 'showOverlay' : '' }
        onClick={ () => handleOverlayClick() } />
      <Panel className={ showPanel ? 'showPanel' : '' }>
        <div className="tab"></div>
        <Main>
          { interimTranscript.length == 0 ?
            <CortanaText>
              { renderCortanaText() }
            </CortanaText> 
            : 
            <Utterance>
              { utterance }
            </Utterance>}
        </Main>
        <Controls>
          { sttState != null &&
            <VoiceMeter sttState={ sttState } color="#6B6BA0" />
          }
        </Controls>
      </Panel>
    </Container>
  )
}

export default SpeechRecognition(options)(CortanaPanel)

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 0;
  top: 100%;
  left: 0;
  opacity: 0;
  z-index: 1000;

  &.showOverlay {
    height: 100%;
    opacity: 1;
    top: 0;
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
  transition: opacity 350ms cubic-bezier(.1, .69, .38, .9);

  &.showOverlay {
    opacity: 1;
  }

`

const Panel = styled.div`
  width: 100%;
  height: 200px;
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 14px 14px 0 0;
  transform: translateY(0);
  transition: transform 350ms cubic-bezier(.1, .69, .38, .9);
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);

  &.showPanel {
    transform: translateY(-200px);
  }

  .tab {
    height: 20px;
  }
`

const Main = styled.div`
  padding: 0 20px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #212121;
  font-size: 17px;
  letter-spacing: -0.41px;
  line-height: 22px;
`

const CortanaText = styled.div`
  font-weight: 600;
  text-align: center;
`

const Utterance = styled.div`
  font-size: 17px;
  text-align: center;
`

const Controls = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 35px;
`