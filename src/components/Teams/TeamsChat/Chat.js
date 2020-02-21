import React, { useState, useContext } from 'react'
import styled from 'styled-components'

const Chat = ({ content, firstName, lastName = 'Jamil' }) => {
  let [ recipientsValue, setRecipientsValue ] = useState(firstName + ' ' + lastName)

  let renderMessages = () => {
    return content.messages.map((message, index) => {
      let isFromLastPerson = index > 0 ? content.messages[index - 1].lastName === content.messages[index].lastName : null

      if (message.lastName != 'user') {
        return (
          <Row className={ isFromLastPerson ? "fromRecipient" : "fromRecipient moreSpaceOnTop" } key={ 'message' + index }>
            { 
              message.photo && !isFromLastPerson ? 
                <UserPhoto>
                  <img src={ 'assets/' + message.photo } />
                </UserPhoto>
                :
                <div style={{ width: '32px', height: '32px' }} />
            }
            <Message className="fromRecipient">
              {
                !isFromLastPerson &&
                  <div className="name">{ firstName + ' ' + message.lastName }</div>
              }
              { message.message }
            </Message>
          </Row>
        )
      } else {
        return (
          <Row className="fromUser" key={ 'message' + index }>
            <Message className="fromUser">
              { message.message }
            </Message>
          </Row>
        )
      }
    })
  }

  return (
    <Container>
      <Recipients>
        <div className="to">To: </div>
        <input className="recipientsInput" 
          value={ recipientsValue }
          onChange={ (event) => setRecipientsValue(event.target.value)} />
      </Recipients>
      <Messages>
        <div className="timestamp">Today 9:27 AM</div>
        { content && renderMessages() }
      </Messages>

    </Container>
  )
}

export default Chat

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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

const Timestamp = styled.div`

`

const Messages = styled.div`
  flex: 1;
  width: 100%;
  background: #eaeaea;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 12px 0;

  .timestamp {
    text-align: center;
    width: 100%;
    font-size: 11px;
    color: #2e2d2c;
  }
`

const Row = styled.div`
  display: flex;
  padding: 0 16px;

  &.moreSpaceOnTop {
    margin-top: 12px;
  }

  &.fromUser {
    justify-content: flex-end;
  }

  &.fromRecipient {
    justify-content: flex-start;
  }
`

const UserPhoto = styled.div`
  width: 32px;
  height: 32px;

  img {
    width: 100%;
    border-radius: 16px;
  }
`

const Message = styled.div`
  max-width: 65%;
  width: auto;
  min-width: 85px;
  padding: 6px;
  line-height: 18px;
  margin-bottom: 2px;
  border-radius: 4px;
  font-size: 13px;

  .name {
    font-size: 11px;
    color: #2e2d2c;
  }


  &.fromUser {
    background: #6264a1;
    color: #fff;
  }

  &.fromRecipient {
    background: #fff;
    margin-left: 8px;
  }
`