import React from 'react'
import styled from 'styled-components'
import UserPhoto from '../UserPhoto'

const AdaptiveCard = ({ chatData = { firstName: 'Jane', lastName: 'Doe', message: '', photo: null } }) => {

  return (
    <Container>
      <Top>
        <UserPhoto 
          size={ 32 }
          firstName={ firstName }
          lastName={ lastName }
          photo={ photo } />
        <Recipient>
          { firstName + ' ' + lastName }
        </Recipient>
      </Top>
      <Main>
        { message && message }
      </Main>
      <Bottom>
        <Button>Send</Button>
        <Button>Cancel</Button>
      </Bottom>
    </Container>
  )
}

export default AdaptiveCard

const Container = styled.div`
  flex: 1;
  margin: 0 16px;
  min-height: 200px;
  background: rgb(255, 255, 255);
  box-shadow: 0px 0.15px 0.45px 0px rgba(0, 0, 0, 0.11), 0px 0.8px 1.8px 0px rgba(0, 0, 0, 0.13);
  border-radius: 4px;
  display: flex;
  color: #252423;
  flex-direction: column;
  letter-spacing: -0.41px;
`

const Top = styled.div`
  height: 64px;
  margin: 0 16px;
  border-bottom: 1px solid #e1dfdd;
  width: calc(100% - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
`

const Recipient = styled.div`
  flex: 1;
  padding: 0 12px;
  font-size: 17px;
  font-weight: normal;
`

const Main = styled.div`
  flex: 1;
  padding: 12px 16px;
`

const Bottom = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
`

const Button = styled.div`
  border: 1px solid rgb(98, 100, 167);
  border-radius: 4px;
  height: 32px;
  min-width: 86px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6264a7;
  letter-spacing: 0;
  font-size: 15px;
  margin-right: 8px;
`