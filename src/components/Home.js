import React from 'react'
import styled from 'styled-components'
import TeamsHome from './Teams/TeamsHome'
import CortanaPanel from './Cortana/CortanaPanel'

const Home = () => {
  return (
    <Container>
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
