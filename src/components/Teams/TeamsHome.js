import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'

import TeamsHeader from './TeamsHeader'
import TeamsFeed from './TeamsFeed'
import TeamsNav from './TeamsNav'

const TeamsHome = ({ selectedModel, showCortanaPanel, actions }) => {
  let { resetCortana, recognizerStop } = actions

  function handleClick() {
    if (selectedModel === 'converged' && showCortanaPanel) {
      resetCortana()
      recognizerStop()
    }
  }

  let containerClasses = classNames({
    'converged': selectedModel === 'converged',
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
  transition: height 350ms cubic-bezier(.1, .69, .38, .9);
`

