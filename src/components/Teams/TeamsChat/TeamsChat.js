import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'

import { GlobalContext } from '../../../contexts/GlobalContext'
import Chat from './Chat'

const capitalizeString = (str) => {
  if (str.includes(" ' ")) {
    str = str.replace(" ' ", "'")
  }
  return str.replace(/\b\w/, v => v.toUpperCase())
}

const TeamsChat = ({ chatData }) => {
  let { firstName, message } = chatData
  let { chatMessages, setChatMessages, setShowTeamsChat, resetCortana } = useContext(GlobalContext)
  let [ inputValue, setInputValue ] = useState(message ? capitalizeString(message) : '')
  let [ chatInputRef, setChatInputRef ] = useState(React.createRef(chatInputRef))

  useEffect(() => {
    chatInputRef.current.focus()
  }, [])

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (inputValue.length > 0) {
        addMessage(inputValue)
      }
    }
  }

  const addMessage = (text) => {
    let messages = chatMessages
    let newMessage = {
      lastName: 'user',
      timestamp: 0,
      photo: 'profilePic2.png',
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
    resetCortana()
    setShowTeamsChat(false)
  }

  return (
    <Container>
      <Header>
        <div className="left">
          <i className="icon-teams icon-teams-Back"
            onClick={ () => handleBackClick() } />
          <i className="icon-teams icon-teams-Spacer" />
        </div>
        <div className="middle">
          <div className="name">
            { firstName + ' ' + 'Jamil' }
          </div>
          <div className="status">
            <span className="dot"></span>
            <span>Available</span>
          </div>
        </div>
        <div className="right">
          <i className="icon-teams icon-teams-Video" />
          <i className="icon-teams icon-teams-Phone" />
        </div>
      </Header>
      <Chat 
        firstName={ firstName }
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
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
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