import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { GlobalContext } from '../../contexts/GlobalContext'
import VoiceMeter from './VoiceMeter'

const CortanaPanel = () => {
  let { showCortanaPanel, setShowCortanaPanel, utterance, sttState } = useContext(GlobalContext)
  let [ showOverlay, setShowOverlay ] = useState(false)
  let [ showPanel, setShowPanel ] = useState(false)

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

  return (
    <Container className={ showOverlay ? 'showOverlay' : '' }>
      <Overlay className={ showOverlay ? 'showOverlay' : '' }
        onClick={ () => setShowCortanaPanel(false) } />
      <Panel className={ showPanel ? 'showPanel' : '' }>
        <div className="tab"></div>
        <Main>
          { !utterance ?
            <CortanaText>
              How can I help you?
            </CortanaText> 
            : 
            <Utterance>
              { utterance }
            </Utterance>}
        </Main>
        <Controls>
          <VoiceMeter sttState={ sttState } color="#6B6BA0" />
        </Controls>
      </Panel>
    </Container>
  )
}

export default CortanaPanel

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