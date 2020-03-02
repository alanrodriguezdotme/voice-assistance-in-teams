import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import VoiceMeter from './VoiceMeter'

const CortanaPanelControls = ({ isMicOn, sttState, getLuisResponse, showFullPanel, selectedModel }) => {

  let controlsClasses = classNames({
    'hybrid': selectedModel === 'hybrid'
  })

  let microphoneClasses = classNames({
    'small': !showFullPanel
  })

  return (
    <Container className={ controlsClasses }>
      { isMicOn ?
        <VoiceMeter sttState={ sttState } color="#6B6BA0" />
        :
        <Microphone className={ microphoneClasses }
          onClick={ () => handleMicClick({ getLuisResponse }) }>
          <i className={ "icon-teams" + (showFullPanel ? "-regular " : " ") + "icon-teams-Microphone" } />
        </Microphone>
      }
    </Container>
  )
}

export default CortanaPanelControls

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48px;
  height: 72px;

  &:not(.fullPanel) {
    margin-bottom: 20px;
    height: 50px;
  }
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
  
  &.small {
    background: transparent;
    font-size: 24px;
    width: 50px;
    height: 50px;
  }
`
