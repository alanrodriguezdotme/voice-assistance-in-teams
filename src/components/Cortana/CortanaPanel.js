import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import SpeechRecognition from 'react-speech-recognition'

import { GlobalContext } from '../../contexts/GlobalContext'
import { SpeechToTextContext } from '../../contexts/SpeechToTextContext'
import { LuisContext } from '../../contexts/LuisContext'
import VoiceMeter from './VoiceMeter'
import CortanaPanelContent from './CortanaPanelContent'
import CortanaPanelControls from './CortanaPanelControls'

const options = {
  autoStart: false,
  continuous: false
}

const CortanaPanel = ({ cortanaText, selectedModel, chatData, showCortanaPanel, playTts, isMicOn, tts, luisResponse }) => {
  let { setShowCortanaPanel, utterance, sttState, resetCortana, setCortanaText, setShowTeamsChat, shouldDisambig, setShowDisambig, setChatData } = useContext(GlobalContext)
  let { getLuisResponse, sendMessage } = useContext(LuisContext)
  let { recognizerStop, handleMicClick } = useContext(SpeechToTextContext)
  let [ showOverlay, setShowOverlay ] = useState(false)
  let [ showPanel, setShowPanel ] = useState(false)
  // let [ showFullPanel, setShowFullPanel ] = useState(true)
  let [ showFullPanel, setShowFullPanel ] = useState(luisResponse && selectedModel === 'distracted')

  // handle timing of transitions
  useEffect(() => {
    if (selectedModel != 'converged') {
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
    } else {
      if (showCortanaPanel) {
        setShowPanel(true)
        setShowOverlay(true)
      } else {
        setShowPanel(false)
        setShowOverlay(false)
      }
    }
  }, [showCortanaPanel, selectedModel])

  useEffect(() => {
    console.log(sttState)
  }, [sttState])

  useEffect(() => {
    if (showCortanaPanel) {
      if (selectedModel === 'distracted') {

        if (luisResponse) { setShowFullPanel(true) } 
        else { setShowFullPanel(false) }

      } else {
        setShowFullPanel(false)
      }

      if (selectedModel === 'full attention' && chatData.firstName) {
        if (!chatData.lastName) {
          setChatData({
            ...chatData,
            lastName: 'Jamil'
          })
        }
        setShowCortanaPanel(false)
        setShowTeamsChat(true)
      }

      if (selectedModel === 'converged') {
        if (chatData.firstName) {
          if (shouldDisambig && !chatData.lastName) {
            setShowTeamsChat(true)
            setShowDisambig(true)
          } else {
            setShowTeamsChat(true)
          }
          if (!chatData.message && !playTts) {
            handleMicClick({ getLuisResponse }, true)
          } else if (chatData.message && !playTts && luisResponse && luisResponse.topScoringIntent.intent != 'confirm') {
            setCortanaText({ title: 'Do you want to send it?', subtitle: chatData.message  })
            handleMicClick({ getLuisResponse })
          }
        }
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
      return (
        <Title>
          { cortanaText.title }
        </Title> 
      )
    }
  }

  let panelClasses = classNames({
    'showPanel': showPanel,
    'fullPanel': showFullPanel
  })

  let overlayClasses = classNames({
    'showOverlay': showOverlay,
    'fullPanel': showFullPanel,
    'converged': selectedModel === 'converged'
  })

  let containerClasses = classNames({
    'showOverlay': showOverlay,
    'converged': selectedModel === 'converged'
  })

  let mainClasses = classNames({
    'converged': selectedModel === 'converged'
  })

  return (
    <Container className={ containerClasses }
      selectedModel={ selectedModel }>
      { selectedModel === 'distracted' &&
        <Overlay className={ overlayClasses }
          onClick={ () => handleOverlayClick() } />
      }
      <Panel className={ selectedModel + ' ' + panelClasses }>
        <div className="tab">
          { !showFullPanel &&
            <div className="handle" />
          }
        </div>
        
        { showFullPanel && 
          <Top>
            <Button onClick={ () => handleOverlayClick() }>
              <i className="icon-teams-regular icon-teams-Cancel" />
            </Button>
            <div className="spacer" />
          </Top>
        }
        { showFullPanel ?
          <Content>
            <CortanaPanelContent
              showFullPanel={ showFullPanel }
              selectedModel={ selectedModel }
              chatData={ chatData }
              cortanaText={ cortanaText } />
          </Content>
          :
          <Main className={ mainClasses }>{ renderCortini() }</Main>
        }
        <CortanaPanelControls
          utterance={ utterance }
          isMicOn={ isMicOn }
          sttState={ sttState }
          selectedModel={ selectedModel }
          getLuisResponse={ getLuisResponse }
          showFullPanel={ showFullPanel } />
      </Panel>
    </Container>
  )
}

export default SpeechRecognition(options)(CortanaPanel)

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 0;
  bottom: 100%;
  left: 0;
  opacity: 0;
  z-index: 1000;
  visibility: hidden;

  &.showOverlay {
    visibility: visible;
    height: 100%;
    opacity: 1;
    bottom: 0;
  }

  &.converged {
    bottom: 0;
    /* position: relative; */

    &.showOverlay {
      height: 200px;
    }
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

  &.converged {
    pointer-events: none;
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
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.2);

  &.showPanel {
    transform: translateY(-200px);

    &:not(.fullPanel) {

    }
  }

  &.fullPanel {
    height: calc(100% - 20px);
    transform: translateY(-100%);
  }

  &.converged {
    /* border-radius: 0; */
    height: 100%;
    /* transition: none; */
  }

  .tab {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    .handle {
      width: 40px;
      height: 5px;
      border-radius: 2.5px;
      background: #ccc;
    }
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
  flex: 1;

  &.converged {
    height: 100%;
  }
`

const Utterance = styled.div`
  font-size: 17px;
  text-align: center;
`