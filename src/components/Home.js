import React, { useContext, useState } from 'react'
import styled from 'styled-components'

import TeamsHome from './Teams/TeamsHome'
import CortanaPanel from './Cortana/CortanaPanel'
import { GlobalContext } from '../contexts/GlobalContext'
import TeamsChat from './Teams/TeamsChat/TeamsChat'
import Settings from './Settings/Settings'

const Home = ({ os }) => {
  let { showTeamsChat, chatData, initSensor, showSettings } = useContext(GlobalContext)
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

  return (
    <Container>
      { 
        os === 'iOS' && 
        showPermission &&
          renderPermission()
      }
      <Settings showSettings={ showSettings } />
      { showTeamsChat && 
        <TeamsChat chatData={ chatData } />}
      <CortanaPanel />
      <TeamsHome />
    </Container>
  )
}

export default Home

const Container = styled.div`
  max-width: 375px;
  max-height: 812px;
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  overflow: hidden;
`

const Orientation = styled.div`
  position: absolute;
  z-index: 9000;
  background: black;
  color: white;
  bottom: 20px;
  left: 20px;
  font-size: 10px;
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