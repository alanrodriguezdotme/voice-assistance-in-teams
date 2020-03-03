import React, { useContext } from 'react'
import styled from 'styled-components'

import { GlobalContext } from '../../contexts/GlobalContext'
import { LuisContext } from '../../contexts/LuisContext'
import CortanaAvatar from './CortanaAvatar'
import UserPhoto from '../UserPhoto'
import UsersData from '../../contexts/UsersData'

const CortanaPanelContent = ({ showFullPanel, selectedModel, chatData, cortanaText, utterance }) => {
  let { resetCortana, shouldDisambig, showDisambig } = useContext(GlobalContext)
  let { sendMessage } = useContext(LuisContext)

  function renderDisambig() {
    let options = UsersData.map((option, i) => {
      return (
        <Person key={ 'disambig' + i }>
          <UserPhoto
            size={ 24 }
            photo={ option.photo }
            firstName={ chatData.firstName}
            lastName={ option.lastName } />
          <Name>
            { chatData.firstName + ' ' + option.lastName }
          </Name>
        </Person>
      )
    })

    return (
      <Disambig>
        { options }
      </Disambig>
    )
  }

  function renderHybridContent() {
    return (
      <Title>
        { cortanaText.title }
      </Title>
    )
  }

  function renderFullPanelContent() {
    return (
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
          {/* { showDisambig && !chatData.lastName ?
              renderDisambig()
              :
              null
          } */}
          { chatData.message &&
            <Actions>
              <Action onClick={ () => sendMessage() }>Send</Action>
              <Action onClick={ () => resetCortana() }>Cancel</Action>
            </Actions> }
        </Scroll>
      </Content>
    )
  }

  return (
    <Container>
      { selectedModel === 'distracted' && showFullPanel && renderFullPanelContent() }
      { selectedModel === 'hybrid' && renderHybridContent() } 
    </Container>
  )
}

export default CortanaPanelContent

const Container = styled.div`

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
  color: #333;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
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

const Disambig = styled.div`
  display: flex;
  flex-direction: column;
`

const Person = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Name = styled.div`

`