import React, { createContext, useContext } from 'react'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { GlobalContext } from './GlobalContext'

let subscriptionKey = 'SUBSCRIPTION_KEY'
let authEndpoint = 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issuetoken'
let authToken
let serviceRegion = "westus"
let recognizer

export const STTContext = createContext()

const STTContextProvider = (props) => {
	const { setSttState, setAvatarState, setShowMic, setShowUtterance, setUtterance, setShowCortanaPanel, appendMessageToChatData, setCortanaText } = useContext(GlobalContext)

	const requestAuthToken = () => {
		if (authEndpoint) {
			let a = new XMLHttpRequest()
			a.open("GET", authEndpoint)
			a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			a.send("")
			a.onload = function() {
				console.log('responseText:', this)
				let token = JSON.parse(atob(this.responseText.split(".")[1]))
				serviceRegion = token.region
				authToken = this.responseText
				console.log("Got an auth token: " + token)
			}
		}
	}

	const playEarcon = (state) => {
		let audio = new Audio('assets/earcons/earcon-' + state + '.wav')
		audio.play()
	}

	function startListening(actions, shouldSkipLUIS, continuous) {
		let speechConfig
		if (authToken) {
			speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authToken, serviceRegion)
		} else {
			speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion)
		}

		speechConfig.speechRecognitionLanguage = "en-US"
		let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput()
		recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig)

		setSttState('RecognitionTriggeredEvent')
		setAvatarState('listening')
		setShowMic(false)
		playEarcon('listening')
		console.log("listening...")

		recognizer.recognizing = (sender, event) => {
			setShowUtterance(true)
			setUtterance(event.result.text)
		}

		recognizer.recognized = (sender, event) => {
			setSttState("recognized")
			setUtterance(null)
			setCortanaText({ title: '' })
			console.log({actions})
			if (shouldSkipLuis) {
				appendMessageToChatData(event.result.text, actions.chatData, { startListening, getLuisResponse: actions.getLuisResponse, model: actions.model })
			} else {
				actions.getLuisResponse(event.result.text, { stopListening, model: actions.model })
			}
			console.log(event.result.text)
		}

		if (continuous) {
			recognizer.startContinuousRecognitionAsync(() => {
				console.log("listening continuously...")
			}, (error) => {
				console.error(error)
				stopListening()
			})
		} else {
			recognizer.recognizeOnceAsync(
				(result) => {
					console.log(result)
					setUtterance(result.text)
					setSttState("recognized")
					if (!shouldSkipLUIS) {
						actions.getLuisResponse(result.text, actions)
					} else {
						appendMessageToChatData(result.text, actions.chatData, { startListening, getLuisResponse: actions.getLuisResponse, model: actions.model })
					}
					stopListening()
				},
				(error) => {
					console.log({error})
					stopListening()
				} 
			)
		}
	}

	function stopListening() {
		if (recognizer) {
			recognizer.close()
			recognizer = undefined
			playEarcon('stoplistening')
			setShowMic(true)
			setSttState(null)
			setUtterance(null)
			setShowUtterance(false)
			console.log("stopped listening")
		}
	}

	return (
		<STTContext.Provider value={{
			requestAuthToken,
			startListening,
			stopListening
		}}>
			{props.children}
		</STTContext.Provider>
	)
}

export default STTContextProvider