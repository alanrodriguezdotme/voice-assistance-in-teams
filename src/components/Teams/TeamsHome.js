import React from 'react'
import styled from 'styled-components'
import TeamsHeader from './TeamsHeader'
import TeamsFeed from './TeamsFeed'
import TeamsNav from './TeamsNav'

const TeamsHome = () => {
  return (
    <Container>
      <TeamsHeader />
      <TeamsFeed />
      <TeamsNav />
    </Container>
  )
}

export default TeamsHome

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

