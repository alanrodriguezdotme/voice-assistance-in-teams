import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import TeamsHome from './Teams/TeamsHome'
import CortanaPanel from './Cortana/CortanaPanel'
import { GlobalContext } from '../contexts/GlobalContext'
import TeamsChat from './Teams/TeamsChat/TeamsChat'

const Home = ({ orientation }) => {
  let { showTeamsChat, chatData } = useContext(GlobalContext)
  let [ showOrientation, setShowOrientation ] = useState(true)

  return (
    <Container>
      { showTeamsChat && 
        <TeamsChat chatData={ chatData } />}
      <CortanaPanel />
      <TeamsHome />
      { orientation && showOrientation && 
        <Orientation onClick={() => setShowOrientation(false)}>
          gamma: { orientation.gamma }<br />
          beta: { orientation.beta }<br />
          alpha: { orientation.alpha }
        </Orientation>
      }
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
  z-index: 10000;
  background: black;
  color: white;
  top: 20px;
  left: 20px;
  font-size: 10px;
`