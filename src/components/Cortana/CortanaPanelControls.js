import React, { useContext } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import VoiceMeter from './VoiceMeter'
import { STTContext } from '../../contexts/STTContext'

const CortanaPanelControls = ({ isMicOn, sttState, getLuisResponse, showFullPanel, selectedModel, utterance }) => {
  let { startListening, stopListening } = useContext(STTContext)

  let controlsClasses = classNames({
    'converged': selectedModel === 'converged',
    'fullPanel': showFullPanel
  })

  let microphoneClasses = classNames({
    'small': !showFullPanel
  })

  function renderUtterance() {
    if (utterance && showFullPanel) {
      return <Utterance>{ utterance }</Utterance>
    } else {
      return <VoiceMeter sttState={ sttState } color="#6B6BA0" />
    }
  }

  return (
    <Container className={ controlsClasses }>
      { isMicOn ?
        renderUtterance()
        :
        <Microphone className={ microphoneClasses }
          onClick={ () => startListening({ getLuisResponse }) }>
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

const Utterance = styled.div`
  color: #6264a7;
  font-size: 18px;
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
