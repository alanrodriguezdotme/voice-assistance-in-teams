import React, { createContext, useContext } from 'react'
import * as SDK from 'microsoft-speech-browser-sdk'

import { GlobalContext } from '../contexts/GlobalContext'

let subscriptionKey = '5bb1fd777df040f18623d946d3ae2833'
let serviceRegion = 'westus'
let recognizer
let skipLuis = false

// set up AudioContext now, to detect if suspended (Chrome doesn't let you play audio unless there is a user gesture first (i.e., click))
let audio = new AudioContext()

export const SpeechToTextContext = createContext()

const SpeechToTextContextProvider = (props) => {
	const { setSttState, setAvatarState, setShowMic, setShowUtterance, setUtterance, setShowCortanaPanel, appendMessageToChatData, setCortanaText } = useContext(GlobalContext)

	const initStt = () => {
		recognizer = recognizerSetup(
			SDK,
			SDK.RecognitionMode.Interactive,
			'en-US',
			'Detailed',
			subscriptionKey
		)
	}

	const resumeAudioContext = () => {
		audio.resume()
		console.log('user clicked, audio resumed')
	}

	const recognizerSetup = (SDK, recognitionMode, language, format, subscriptionKey) => {
		let recognizerConfig = new SDK.RecognizerConfig(
			new SDK.SpeechConfig(
				new SDK.Context(
					new SDK.OS(navigator.userAgent, "Browser", null),
					new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
			recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
			language, // Supported languages are specific to each recognition mode Refer to docs.
			format) // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

		// Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    let authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey)

		return SDK.CreateRecognizer(recognizerConfig, authentication)
	}

	const playEarcon = (state) => {
		if (audio.state != 'suspended') {
			let audio = new Audio('assets/earcons/earcon-' + state + '.wav')
			audio.play()
		}
	}

	const handleMicClick = (actions, shouldSkipLuis) => {
		recognizerStart(SDK, recognizer, actions)
		if (shouldSkipLuis != undefined && shouldSkipLuis != null) {
			skipLuis = shouldSkipLuis
		} else {
			skipLuis = false
		}
  }

	const recognizerStart = (SDK, recognizer, actions) => {
		recognizer.Recognize((event) => {
			switch (event.Name) {
				case "RecognitionTriggeredEvent":
					setSttState('RecognitionTriggeredEvent')
					setAvatarState('listening')
					setShowMic(false)
					console.log("Initializing")
					playEarcon('listening')
					break
				case "ListeningStartedEvent":
					console.log("Listening")
					setSttState('ListeningStartedEvent')
					break
				case "RecognitionStartedEvent":
					console.log("Listening_Recognizing")
					break
				case "SpeechStartDetectedEvent":
					console.log("Listening_DetectedSpeech_Recognizing")
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					break
				case "SpeechHypothesisEvent":
					setShowUtterance(true)
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					setUtterance(event.result.Text)
					setSttState('SpeechHypothesisEvent')
					break
				case "SpeechFragmentEvent":
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					break
				case "SpeechEndDetectedEvent":
					console.log("Processing_Adding_Final_Touches")
					console.log(JSON.stringify(event.Result)) // check console for other information in result
					playEarcon('stoplistening')
					setShowMic(true)
					setSttState('SpeechEndDetectedEvent')
					setAvatarState('thinking')
					break
				case "SpeechSimplePhraseEvent":
					break
				case "SpeechDetailedPhraseEvent":
					setSttState('SpeechDetailedPhraseEvent')
					if (event.Result.NBest) {
						console.log(event.Result.NBest[0].ITN)
						setCortanaText({ title: '' })
						if (!skipLuis) {
							actions.getLuisResponse(JSON.stringify(event.Result.NBest[0].ITN), { initStt, recognizerStop, model: actions.model })
						} else {
							appendMessageToChatData(event.Result.NBest[0].ITN, actions.chatData, { handleMicClick, getLuisResponse: actions.getLuisResponse, model: actions.model })
						}
					} else {
						setAvatarState('calm')
						setShowCortanaPanel(false)
					}
					setUtterance(null)
					break
				case "RecognitionEndedEvent":
					setSttState('RecognitionEndedEvent')
					setShowUtterance(false)
					if (event.Result.NBest) {
            console.log(event.Result.NBest[0].ITN)
					}
					break
			}
		})
		.On(() => {
			setSttState(null)
			setUtterance(null)
		},
		(error) => {
			error && console.error('STT error', error)
			initStt()
			setSttState(null)
			setUtterance(null)
		})
	}

	const recognizerStop = (reset) => {
		if (recognizer) {
			recognizer.AudioSource.TurnOff()
		} else {
			initStt()
		}
	}

	return (
		<SpeechToTextContext.Provider value={{ initStt, handleMicClick, recognizerStop, recognizerSetup, resumeAudioContext }}>
			{ props.children }
		</SpeechToTextContext.Provider>
	)
}

export default SpeechToTextContextProvider