import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import Toggle from 'react-toggle'
import ReactMarkdown from 'react-markdown'

import { GlobalContext } from '../../contexts/GlobalContext'

let input = `
  # Cortana Convergence Prototype
  ---
  ## Instructions
  Tap on the microphone icon (<i class="icon-teams icon-teams-Microphone" />) next to the search box to invoke Cortana. You can also say "Hey Cortana". Then, you can say the following:

  ### "Send a message to (first name)"
  This will bring up the disambiguation flow.

  ### "Send a message to (first name and last name) that (message)"
  This will be a one-shot flow.
  ---
  ## Settings
  Tap on the filter icon (<i class="icon-teams icon-teams-Filter" />) in the top right to view the settings panel for this prototype.
`

const Instructions = () => {
  let { showInstructions, setShowInstructions } = useContext(GlobalContext)
  let [ shouldShow, setShouldShow ] = useState(showInstructions)

  useEffect(() => {
    setShouldShow(showInstructions)
  }, [showInstructions])

  function handleShowInstructionsToggle(event) {
    console.log(event.target.checked, showInstructions, shouldShow, localStorage.showInstructions)
    setShouldShow(event.target.checked)
  }

  function handleOKClick() {    
    localStorage.setItem('showInstructions', shouldShow)
    setShowInstructions(false)
  }

  return (
    <Container id="instructions">
      <Text>
        <ReactMarkdown 
          source={ input }
          escapeHtml={ false } />
      </Text>
      <Controls>
        <Control className="left">
          <Toggle
            checked={ shouldShow }
            onChange={ (event) => handleShowInstructionsToggle(event) } />
          <Label>
            Show instructions next time
          </Label>
        </Control>
        <Control>
          <Button
            onClick={ () => handleOKClick() }>
            OK
          </Button>
        </Control>
      </Controls>
    </Container>
  )
}

export default Instructions

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 9100;
  width: 100%;
  height: 100%;
  color: white;
  background: rgba(0, 0, 0, 0.85);
  padding: 0 20px 40px 20px;
  overflow-y: auto;
`

const Label = styled.div`
  padding-left: 12px;
`

const Text = styled.div`
  margin: 0 0 12px 0;
  flex: 1;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
`

const Control = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 12px 0 0;

  &.left {
    flex: 1;
  }
`

const Button = styled.div`
  padding: 8px 12px;
  background: #6264a7;
  border-radius: 4px;
`