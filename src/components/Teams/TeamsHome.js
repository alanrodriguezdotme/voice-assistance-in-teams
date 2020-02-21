import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import TeamsHeader from './TeamsHeader'
import TeamsFeed from './TeamsFeed'
import TeamsNav from './TeamsNav'

const TeamsHome = ({ selectedModel, showCortanaPanel, actions }) => {
  let { resetCortana, recognizerStop } = actions
  function handleClick() {
    if (selectedModel === 'hybrid' && showCortanaPanel) {
      resetCortana()
      recognizerStop()
    }
  }

  let containerClasses = classNames({
    'hybrid': selectedModel === 'hybrid',
    'showCortanaPanel': showCortanaPanel
  })

  return (
    <Container
      className={ containerClasses }
      onClick={ () => handleClick() }
      selectedModel={ selectedModel }>
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

