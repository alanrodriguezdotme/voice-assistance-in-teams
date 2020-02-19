import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import SpeechRecognition from 'react-speech-recognition'

import { GlobalContext } from '../../contexts/GlobalContext'
import { SpeechToTextContext } from '../../contexts/SpeechToTextContext'
import VoiceMeter from './VoiceMeter'
import AdaptiveCard from './AdaptiveCard'
import CortanaAvatar from './CortanaAvatar'
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
  let { showCortanaPanel, setShowCortanaPanel, utterance, sttState, luisResponse, resetCortana, fullAttentionMode, chatData, avatarState } = useContext(GlobalContext)
  let { recognizerStop } = useContext(SpeechToTextContext)
  // const { sttStop } = useContext(BrowserSTTContext)
  let [ showOverlay, setShowOverlay ] = useState(false)
  let [ showPanel, setShowPanel ] = useState(false)
  // let [ showFullPanel, setShowFullPanel ] = useState(true)
  let [ showFullPanel, setShowFullPanel ] = useState(luisResponse && !fullAttentionMode && chatData)

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

  useEffect(() => {
    if (luisResponse && !fullAttentionMode && chatData) {
      setShowFullPanel(true)
    } else {
      setShowFullPanel(false)
    }
  }, [luisResponse, fullAttentionMode, chatData])

  function renderCortanaText () {
    let text = ''
    if (!luisResponse) {
      text = "How can I help you?"
    } else {
      text = "I'm on it..."
    }

    return (
      <CortanaText>
        { text }  
      </CortanaText>

    )
  }

  function handleOverlayClick() {
    recognizerStop()
    // sttStop()
    // stopListening()
    resetCortana()
  }

  function renderCortini() {
    if (utterance) {
      return (
        <Utterance>
          { utterance }
        </Utterance>
      )
    } else {
      return renderCortanaText()
    }
  }

  let panelClasses = classNames({
    'showPanel': showPanel,
    'fullPanel': showFullPanel
  })

  return (
    <Container className={ showOverlay ? 'showOverlay' : '' }>
      <Overlay className={ showOverlay ? 'showOverlay' : '' }
        onClick={ () => handleOverlayClick() } />
      <Panel className={ panelClasses }>
        <div className="tab"></div>
        { showFullPanel && 
          <Top>
            <Button onClick={ () => handleOverlayClick() }>
              <i className="icon-teams icon-teams-Back" />
            </Button>
            <div className="spacer" />
          </Top>
        }
        {
          chatData && !fullAttentionMode &&
            <Content>
              <CortanaAvatar
                state={ avatarState } />
              <Title>
                { renderCortanaText() }
              </Title>
              <Cards>
                <AdaptiveCard 
                  firstName={ chatData.firstName && chatData.firstName }
                  lastName={ chatData.lastName && chatData.lastName }
                  message={ chatData.message && chatData.message }
                  photo={ chatData.photo && chatData.photo } />
              </Cards>
            </Content>
        }
        <Main>
          { !showFullPanel ? 
            renderCortini()
            :
            <Utterance>
              { utterance }
            </Utterance>
          }
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
  background: #faf9f8;
  border-radius: 14px 14px 0 0;
  transform: translateY(0);
  transition: transform 250ms cubic-bezier(.1, .69, .38, .9), height 250ms cubic-bezier(.1, .69, .38, .9);
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.05);

  &.showPanel {
    transform: translateY(-200px);

    &:not(.fullPanel) {

    }
  }

  &.fullPanel {
    height: calc(100% - 20px);
    transform: translateY(-100%);
  }

  .tab {
    height: 20px;
  }
`

const Top = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin-bottom: 44px;

  .spacer {
    flex: 1;
  }
`

const Button = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #212121;
`

const Content = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  max-height: 100px;
  padding: 24px 0 40px 0;
`

const Cards = styled.div`
  flex: 1;
  overflow-y: auto;
`

const Main = styled.div`
  padding: 0 20px;
  height: 113px;
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