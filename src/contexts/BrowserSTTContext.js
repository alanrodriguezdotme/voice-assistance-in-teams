import React, { useEffect, createContext } from 'react'
import styled from 'styled-components'

export const BrowserSTTContext = createContext()

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let recognition = new SpeechRecognition()
let speechRecognitionList = new SpeechGrammarList()

const BrowserSTTContextProvider = (props) => {

  function initBrowserSTT() {
    recognition.grammars = speechRecognitionList
    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.maxAlternatives = 2
    recognition.onresult = function(event) {
      console.log(event.results)
    }
    recognition.onspeechend = function() {
      recognition.stop()
    }
    recognition.onerror = function(event) {
      console.error(event.error)
    }
  }

  useEffect(() => {
    initBrowserSTT()
  }, [])

  const sttStart = () => {
    recognition.start()
  }

  const sttStop = () => {
    recognition.stop()
  }

  return (
    <BrowserSTTContext.Provider value={{
      sttStart, sttStop, initBrowserSTT
    }}>
      {props.children}
    </BrowserSTTContext.Provider>
  )
}

export default BrowserSTTContextProvider

