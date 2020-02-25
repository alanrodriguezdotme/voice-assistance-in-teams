import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import TeamsHome from './Teams/TeamsHome'
import CortanaPanel from './Cortana/CortanaPanel'
import { GlobalContext } from '../contexts/GlobalContext'
import TeamsChat from './Teams/TeamsChat/TeamsChat'
import Settings from './Settings/Settings'
import { SpeechToTextContext } from '../contexts/SpeechToTextContext'

const Home = ({ os, tts }) => {
  let { showTeamsChat, luisResponse, chatData, initSensor, resetCortana, showSettings, cortanaText, selectedModel, showCortanaPanel, playTts, isMicOn, shouldSendMessage } = useContext(GlobalContext)
  let { recognizerStop } = useContext(SpeechToTextContext)
  let [ showPermission, setShowPermission ] = useState(true)

  function getMedia(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        /* use the stream */
        console.log(stream)
        alert('microphone?')
      })
      .catch(function(err) {
        alert(err)
        /* handle the error */
        console.log(err)
      });
  }

  function handlePermissionClick() {
    // feature detect
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            initSensor()
            setShowPermission(false)
            getMedia({ audio: true })
          }
          // alert(response)
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }
  }

  const renderPermission = () => {
    return (
      <Permission>
        <div className="main">
          This prototype requires the use of your device's sensors.

        </div>
        <div className="button"
          onClick={ () => handlePermissionClick() }>
          Request permission
        </div>
      </Permission>
    )
  }

  function handleTeamsWrapperClick() {
    if (selectedModel === 'hybrid' && showCortanaPanel) {
      resetCortana(false)
      recognizerStop()
    }
  }

  let teamsWrapperClasses = classNames({
    'hybrid': selectedModel === 'hybrid',
    'showCortanaPanel': showCortanaPanel
  })

  return (
    <Container
      selectedModel={ selectedModel }>
      {
        os === 'iOS' &&
        showPermission &&
          renderPermission()
      }
      <Settings
        showSettings={ showSettings } />
      <TeamsWrapper classNames={ teamsWrapperClasses }
        onClick={ () => handleTeamsWrapperClick() }>
        { showTeamsChat ?
          <TeamsChat
            shouldSendMessage={ shouldSendMessage }
            actions={{ resetCortana, recognizerStop }}
            chatData={ chatData }
            selectedModel={ selectedModel } />
          :
          <TeamsHome
            actions={{ resetCortana, recognizerStop }}
            selectedModel={ selectedModel }
            showCortanaPanel={ showCortanaPanel } />
        }
      </TeamsWrapper>
      <CortanaPanel
        luisResponse={ luisResponse }
        tts={ tts }
        showCortanaPanel={ showCortanaPanel }
        cortanaText={ cortanaText }
        selectedModel={ selectedModel }
        chatData={ chatData }
        playTts={ playTts}
        isMicOn={ isMicOn } />
    </Container>
  )
}

export default Home

const Container = styled.div`
  max-width: 411px;
  max-height: 846px;
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  overflow: hidden;
  display: ${ p => p.selectedModel === 'hybrid' ? 'flex' : 'block' };
  flex-direction: column;

  @media (max-width: 500px) {
    max-width: 100%;
    max-height: 100%;
  }
`

const TeamsWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  transition: height 350ms cubic-bezier(.1, .69, .38, .9);

  &.hybrid, &.showCortanaPanel {
    height: calc(100% - 200px);
  }
`

const Permission = styled.div`
  position: absolute;
  z-index: 9500;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .main {
    padding: 12px 20px;
    margin-bottom: 12px;
    max-width: 400px;
    text-align: center;
    font-size: 18px;
  }

  .button {
    background: white;
    color: black;
    padding: 12px;
  }
`