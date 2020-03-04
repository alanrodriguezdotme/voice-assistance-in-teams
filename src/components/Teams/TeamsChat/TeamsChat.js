import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import { GlobalContext } from '../../../contexts/GlobalContext'
import Chat from './Chat'
import Disambig from './Disambig'
import { LuisContext } from '../../../contexts/LuisContext'
import { SpeechToTextContext } from '../../../contexts/SpeechToTextContext'

const capitalizeString = (str) => {
  if (str.includes(" ' ")) {
    str = str.replace(" ' ", "'")
  }
  return str.replace(/\b\w/, v => v.toUpperCase())
}

const TeamsChat = ({ chatData, selectedModel, shouldSendMessage, showCortanaPanel, showDisambig, peopleData }) => {
  let { firstName, lastName, message } = chatData
  let { chatMessages, setChatMessages, setShowTeamsChat, resetCortana, shouldDisambig, setShowDisambig } = useContext(GlobalContext)
  let { resetLuis } = useContext(LuisContext)
  let { recognizerStop } = useContext(SpeechToTextContext)
  let [ firstNameValue, setFirstNameValue ] = useState(firstName ? firstName : '')
  let [ lastNameValue, setLastNameValue ] = useState(lastName ? lastName : '')
  let [ inputValue, setInputValue ] = useState(chatData.message ? capitalizeString(message) : '')
  let [ chatInputRef, setChatInputRef ] = useState(React.createRef(chatInputRef))
  let [ recipientsValue, setRecipientsValue ] = useState(!shouldDisambig && lastNameValue.length > 0 ? firstNameValue + ' ' + lastNameValue : firstNameValue + ' ' + lastNameValue)

  useEffect(() => {
    if (selectedModel === 'full attention') {
      chatInputRef.current.focus()
    }
  }, [selectedModel])

  useEffect(() => {
    if (message) { setInputValue(message) }
    if (firstName && firstName != firstNameValue) { 
      setFirstNameValue(firstName) 
    }
    if (lastName && lastName != lastNameValue) {
      setLastNameValue(lastName)
      setRecipientsValue(firstNameValue + ' ' + lastName)
      setShowDisambig(false)
    }
    if (shouldSendMessage && inputValue.length > 0) { handleSendClick() }
  }, [firstName, message, shouldSendMessage, lastName])

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (inputValue.length > 0) {
        addMessage(inputValue)
      }
    }
  }

  function handleTeamsWrapperClick() {
    if (selectedModel === 'converged' && showCortanaPanel) {
      resetCortana(false)
      recognizerStop()
    }
  }

  const addMessage = (text) => {
    let messages = chatMessages
    let newMessage = {
      lastName: 'user',
      timestamp: 0,
      // photo: 'profilePic2.png',
      message: text
    }

    messages.push(newMessage)
    setChatMessages([...messages])
    setInputValue('')
  }

  const handleSendClick = () => {
    if (inputValue.length > 0) {
      addMessage(inputValue)
    }
  }

  const handleBackClick = () => {
    resetCortana(true)
    setShowTeamsChat(false)
    resetLuis()
  }

  let teamsChatClasses = classNames({
    'showCortanaPanel': showCortanaPanel
  })

  return (
    <Container
      className={ selectedModel + ' ' + teamsChatClasses }>
      <Header>
        <div className="left">
          <i className="icon-teams icon-teams-Back"
            onClick={ () => handleBackClick() } />
          <i className="icon-teams icon-teams-Spacer" />
        </div>
        <div className="middle">
          { showDisambig ? 
            <div className="title">
              New chat
            </div>
            :
            [
              <div className="name" key={'name'}>
                { firstNameValue + ' ' + lastNameValue }
              </div>,
              <div className="status" key={'status'}>
                <span className="dot"></span>
                <span>Available</span>
              </div>
            ]
          }
        </div>
        <div className="right">
          <i className="icon-teams icon-teams-Video" />
          <i className="icon-teams icon-teams-Phone" />
        </div>
      </Header>      
      <Recipients>
        <div className="to">To: </div>
        <input className="recipientsInput" 
          value={ recipientsValue }
          onChange={ (event) => setRecipientsValue(event.target.value)} />
      </Recipients>
      { showDisambig ? 
        <Disambig
          firstName={ chatData.firstName }
          peopleData={ peopleData }
          chatData={ chatData } />
        :
        <ChatWrapper className={ selectedModel } onClick={ () => !showDisambig && handleTeamsWrapperClick() }>
          <Chat 
            chatData={ chatData }
            firstName={ firstNameValue }
            lastName={ lastNameValue }
            content={{ messages: chatMessages }} />
          <Footer>
            <div className="left">
              <i className="icon-teams icon-teams-CirclePlus" />
            </div>
            <div className="middle">
              <input className="footerInput"
                ref={ chatInputRef }
                value={ inputValue }
                onKeyPress={ onKeyPress }
                onChange={ (event) => setInputValue(event.target.value) }
                placeholder="Type a new message" />
              <div className="smiley">
                <i className="icon-teams icon-teams-Smiley" />
              </div>
            </div>
            <div className="right"
              onClick={ () => handleSendClick() }>
              <i className={ "icon-teams-regular icon-teams-Send" + (inputValue.length == 0 ? ' disabled' : '') } />
            </div>
          </Footer>
        </ChatWrapper>
      }
    </Container>
  )
}

export default TeamsChat

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  top: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;

  &.converged {
    &.showCortanaPanel {
      height: calc(100% - 200px);
    } 
  } 
`

const Header = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  background: #f9f9f9;
  border-bottom: 1px solid #eaeaea;

  .left, .right {
    height: 100%;
    display: flex;

    .icon-teams {
      width: 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
  }

  .middle {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .name {
      font-size: 12px;
      font-weight: 700;
      color: #6264a1;
    }

    .status {
      font-size: 11px;
      line-height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;

      .dot {
        width: 6px;
        height: 6px;
        background: green;
        border-radius: 3px;
        margin-right: 3px;
      }
    }
  }
`

const ChatWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  &.converged {
    height: calc(100% - 200px);
  }
`

const Recipients = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  font-size: 14px;

  .to {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
    color: #666;
    font-size: 14px;
  }

  .recipientsInput {
    flex: 1;
    border: none;
    background: white;
    font-family: 'Roboto', sans-serif;
    outline: none;
    color: #6464ae;
    font-size: 14px;
  }
`

const Footer = styled.div`
  width: 100%;
  height: 40px;
  background: #eaeaea;
  border-top: 1px solid #dedede;
  display: flex;
  align-items: center;
  justify-content: center;

  .left, .right {
    width: 36px;
    height: 100%;
    color: #6464ae;
    display: flex;
    align-items: center;
    justify-content: center;

    .disabled {
      opacity: 0.5;
    }

    .icon-teams {
      width: 100%;
      height: 100%;
    }
  }

  .middle {
    flex: 1;
    display: flex;
    border: 1px solid #dedede;
    border-radius: 4px;
    height: 32px;
    background: white;
    padding-left: 4px;

    .footerInput {
      flex: 1;
      outline: none;
      border: none;
      padding: 0 4px;
      height: 100%;
    }

    .smiley {
      height: 30px;
      width: 30px;
      color: #6464ae;

      .icon-teams {
        width: 100%;
        height: 100%;        
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`