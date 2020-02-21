import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import SpeechRecognition from 'react-speech-recognition'

import { GlobalContext } from '../../contexts/GlobalContext'
import { SpeechToTextContext } from '../../contexts/SpeechToTextContext'
import TextToSpeech from '../../contexts/TextToSpeech'
import VoiceMeter from './VoiceMeter'
import AdaptiveCard from './AdaptiveCard'
import CortanaAvatar from './CortanaAvatar'
import { LuisContext } from '../../contexts/LuisContext'

const options = {
  autoStart: false,
  continuous: false
}

const CortanaPanel = ({ cortanaText, selectedModel, chatData, showCortanaPanel }) => {
  let { setShowCortanaPanel, utterance, sttState, luisResponse, resetCortana, setCortanaText, setShowTeamsChat } = useContext(GlobalContext)
  let { getLuisRsesponse } = useContext(LuisContext)
  let { recognizerStop, handleMicClick } = useContext(SpeechToTextContext)
  let [ showOverlay, setShowOverlay ] = useState(false)
  let [ showPanel, setShowPanel ] = useState(false)
  // let [ showFullPanel, setShowFullPanel ] = useState(true)
  let [ showFullPanel, setShowFullPanel ] = useState(luisResponse && selectedModel === 'distracted')
  let tts = new TextToSpeech(process.env.ACCESS_TOKEN)

  // handle timing of transitions
  useEffect(() => {
    if (showCortanaPanel) {
      setShowOverlay(true)
      setTimeout(() => {
        setShowPanel(true)
      }, 350)
    } else {
      setShowPanel(false)
      setTimeout(() => {
        setShowOverlay(false)
      }, 350)
    }
  }, [showCortanaPanel])

  useEffect(() => {
    if (showCortanaPanel) {
      if (selectedModel === 'distracted') {
        if (luisResponse) {
          setShowFullPanel(true)
        } else {
          setShowFullPanel(false)
        }

        if (chatData.message) {          
          tts.speak("Do you want to send it?", () => {
            handleMicClick({getLuisRsesponse})
          })
        } else if (chatData.firstName) {          
          tts.speak("What's your message for " + chatData.firstName + "?", () => {
            handleMicClick({getLuisRsesponse})
          })
        }
      } else {
        setShowFullPanel(false)
      }

      if (selectedModel === 'full attention' && chatData.firstName) {
        setShowCortanaPanel(false)
        setShowTeamsChat(true)
      }
    }
  }, [luisResponse, selectedModel, chatData, showCortanaPanel])

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
      return cortanaText.title
    }
  }

  let panelClasses = classNames({
    'showPanel': showPanel,
    'fullPanel': showFullPanel,
    'hybrid': selectedModel === 'hybrid'
  })

  let overlayClasses = classNames({
    'showOverlay': showOverlay,
    'fullPanel': showFullPanel
  })

  return (
    <Container className={ showOverlay ? 'showOverlay' : '' }
      selectedModel={ selectedModel }>
      { selectedModel === 'hybrid' && 
        <Overlay className={ overlayClasses }
          onClick={ () => handleOverlayClick() } />
      }
      <Panel className={ panelClasses }>
        <div className="tab"></div>
        { showFullPanel &&
          <Top>
            <Button onClick={ () => handleOverlayClick() }>
              <i className="icon-teams-regular icon-teams-Cancel" />
            </Button>
            <div className="spacer" />
          </Top>
        }
        { showFullPanel &&
            <Content>
              <CortanaAvatar
                image={ chatData.photo }
                size={ 'large' }
                state={ 'calm' } />
              <Title className="fullPanel">
                { cortanaText.title }
              </Title>
              <Scroll>
                { utterance && !cortanaText.subtitle ?
                  <Utterance>
                    { utterance }
                  </Utterance>
                  :
                  <Message>
                    { cortanaText.subtitle }
                  </Message>
                }
                { chatData.message &&
                  <Actions>
                    <Action>Send</Action>
                    <Action>Cancel</Action>
                  </Actions> }
              </Scroll>
            </Content>
        }
        { !showFullPanel &&
            <Main>{ renderCortini() }</Main>
        }
        <Controls>
          { sttState ?
            <VoiceMeter sttState={ sttState } color="#6B6BA0" />
            :
            <Microphone onClick={ () => handleMicClick({ getLuisRsesponse }) }>
              <i className="icon-teams-regular icon-teams-Microphone" />
            </Microphone>
          }
        </Controls>
      </Panel>
    </Container>
  )
}

export default SpeechRecognition(options)(CortanaPanel)

const Container = styled.div`
  position: ${ p => p.selectedModel === 'hybrid' ? 'relative' : 'absolute' };
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
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 350ms cubic-bezier(.1, .69, .38, .9), background-color 350ms cubic-bezier(.1, .69, .38, .9);

  &.showOverlay {
    opacity: 1;
  }

  &.fullPanel {
    background-color: #6264a7;
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

  &.hybrid {
    border-radius: 0;
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
  color: #212121;

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
  font-size: 18px;
`

const Content = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  max-height: 100px;
  padding: 24px 20px 24px 20px;
  font-weight: bold;
  text-align: center;

  &.fullPanel {
    font-size: 28px;
  }
`

const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const Message = styled.div`
  width: 100%;
  padding: 0 20px 20px 20px;
  text-align: center;
  font-size: 22px;
  letter-spacing: 0.35px;
  line-height: 28px;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Action = styled.div`
  min-width: 110px;
  height: 48px;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  border: 1px solid rgb(98, 100, 167);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #6264a7;
  font-size: 18px;

  &:first-child{
    margin-right: 20px;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 72px;
`

const Microphone = styled.div`
  width: 72px;
  height: 72px;
  background: rgba(98, 100, 167, 0.07);
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #6264a7;
`