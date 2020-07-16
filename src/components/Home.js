import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import TeamsHome from './Teams/TeamsHome'
import CortanaPanel from './Cortana/CortanaPanel'
import { GlobalContext } from '../contexts/GlobalContext'
import TeamsChat from './Teams/TeamsChat/TeamsChat'
import Settings from './Settings/Settings'
import Instructions from './Instructions/Instructions'
import { LuisContext } from '../contexts/LuisContext'
import { STTContext } from '../contexts/STTContext'

const Home = ({ os, tts }) => {
  let { showTeamsChat, luisResponse, chatData, initSensor, resetCortana, showSettings, cortanaText, selectedModel, setSelectedModel, showCortanaPanel, setShowCortanaPanel, playTts, isMicOn, shouldSendMessage, showDisambig, peopleData, showInstructions, userGeneratedInvocation, voiceInvocation, showCortana } = useContext(GlobalContext)
  let { startListening, stopListening } = useContext(STTContext)
  let { getLuisResponse } = useContext(LuisContext)
  let [ showPermission, setShowPermission ] = useState(true)
  let [ userClicked, setUserClicked ] = useState(false)

  useEffect(() => {
    if (annyang) {
      // Define invocation commands
      var commands = {
        'hey cortana': () => {
          showCortana(true, userGeneratedInvocation, { startListening, getLuisResponse })
        },
        'cortana': () => {
          showCortana(true, userGeneratedInvocation, { startListening, getLuisResponse })
        },
        'marco': () => {
          console.log('Polo!')
        }
      }
      annyang.addCommands(commands);

      if (voiceInvocation) {
        console.log('starting annyang...')
        annyang.start()
      } else {
        console.log('aborting annyang...')
        annyang.abort()
      }
    }

  }, [voiceInvocation])

  // after user clicks anywhere, resume audio context so earcons will play
  // useEffect(() => {
  //   userClicked && resumeAudioContext()
  // }, [ userClicked ])

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

  let teamsWrapperClasses = classNames({
    'converged': selectedModel === 'converged',
    'showCortanaPanel': showCortanaPanel,
    'showTeamsChat': showTeamsChat
  })

  return (
    <Container
      onClick={ () => !userClicked && setUserClicked(true)}
      selectedModel={ selectedModel }>
      {
        os === 'iOS' &&
        showPermission &&
          renderPermission()
      }
      {
        showInstructions &&
        <Instructions />
      }
      <Settings
        showSettings={ showSettings } />
      <TeamsWrapper classNames={ teamsWrapperClasses }>
        { showTeamsChat ?
          <TeamsChat
            peopleData={ peopleData }
            showCortanaPanel={ showCortanaPanel }
            shouldSendMessage={ shouldSendMessage }
            showDisambig={ showDisambig }
            actions={{ resetCortana, stopListening }}
            chatData={ chatData }
            selectedModel={ selectedModel } />
          :
          <TeamsHome
            actions={{ resetCortana, stopListening }}
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
  /* display: ${ p => p.selectedModel === 'converged' ? 'flex' : 'block' }; */
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

  /* &.converged &.showCortanaPanel &.showTeamsChat {
    height: calc(100% - 200px);
  } */
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