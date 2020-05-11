import React, { useState, createContext, useEffect } from 'react'

import TeamsChatData from './TeamsChatData'
import UsersData from './UsersData'
import TextToSpeech from './TextToSpeech'
let tts = new TextToSpeech()

let defaultCortanaText = {
	title: "How can I help?",
	subtitle: null
}

let defaultChatData = {
	firstName: null,
	lastName: null,
	message: null,
	photo: null
}

let emptyCortanaText = {
	title: '',
	subtitle: null
}

export const GlobalContext = createContext()

const GlobalContextProvider = (props) => {
	let [ avatarState, setAvatarState ] = useState('calm')
	let [ chatData, setChatData ] = useState(defaultChatData)
	let [ chatMessages, setChatMessages ] = useState(TeamsChatData)
	let [ cortanaText, setCortanaText ] = useState(defaultCortanaText)
	let [ fullAttentionMode, setFullAttentionMode ] = useState(false)
	let [ isMicOn, setIsMicOn ] = useState(false)
	let [ luisResponse, setLuisResponse ] = useState(null)
	let [ orientation, setOrientation ] = useState(null)
	let [ peopleData, setPeopleData ] = useState(UsersData)
	let [ playTts, setPlayTts ] = useState(true)
	let [ selectedModel, setSelectedModel ] = useState('converged')
	let [ shouldDisambig, setShouldDisambig ] = useState(true)
	let [ shouldSendMessage, setShouldSendMessage ] = useState(false)
	let [ showCortanaPanel, setShowCortanaPanel ] = useState(false)
	let [ showDisambig, setShowDisambig ] = useState(false)
	let [ showInstructions, setShowInstructions ] = useState(localStorage.showInstructions ? JSON.parse(localStorage.showInstructions) : true)
	// let [ showInstructions, setShowInstructions ] = useState(true)
	let [ showMic, setShowMic ] = useState(true)
	let [ showSettings, setShowSettings ] = useState(false)
	let [ showTeamsChat, setShowTeamsChat ] = useState(false)
	let [ showUtterance, setShowUtterance ] = useState(false)
	let [ sttState, setSttState ] = useState(null)
	let [ userGeneratedInvocation, setUserGeneratedInvocation ] = useState(true)
	let [ utterance, setUtterance ] = useState(null)
	let [ voiceInvocation, setVoiceInvocation ] = useState(true)

	const resetCortana = (resetChatMessages) => {
		setSttState(null)
		setUtterance(null)
		setAvatarState('calm')
		setLuisResponse(null)
		setShowCortanaPanel(false)
		setCortanaText(emptyCortanaText)
		if (resetChatMessages) { 
			setChatMessages(TeamsChatData)
			setChatData(defaultChatData) 
		}
	}

	function getMobileOperatingSystem() {
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	
			if (/android/i.test(userAgent)) {
					return "Android";
			}
	
			// iOS detection from: http://stackoverflow.com/a/9039885/177710
			if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
					return "iOS";
			}
	
			return "unknown";
	}

	function appendMessageToChatData(message, data, actions) {
		console.log('appendMessageToChatData: ', message, data, actions)
		if (message && data.lastName) {
			setChatData({ ...data, message })
			setCortanaText({ 
				title: 'Do you want to send it?', 
				subtitle: message 
			})
	
			if (playTts) {
				if (actions.model === 'distracted') {
					tts.speak('Ok, sending a message to ' + data.firstName + ' ' + data.lastName + ' that says ' + message + '. Send it?', () => {
						actions.handleMicClick({ 
							getLuisResponse: actions.getLuisResponse, 
							chatData: { ...data, message } 
						}, false)
					})
				} else {
					tts.speak("Do you want to send it?", () => {
						actions.handleMicClick({ 
							getLuisResponse, 
							chatData: newChatData 
						}, false)
					})
				}
			} else {
				actions.handleMicClick({ getLuisResponse: actions.getLuisResponse, chatData: data }, false)
			}
		}
	}

	const initSensor = () => {
		window.addEventListener('deviceorientation', function(eventData) {
			// gamma is the left-to-right tilt in degrees
			// beta is the front-to-back tilt in degrees
			// alpha is the compass direction the device is facing in degrees
			let { gamma, beta, alpha } = eventData
			
			setOrientation({ gamma, beta, alpha })

			if (beta > 20) {
				setFullAttentionMode(true)
			} else { 
				setFullAttentionMode(false)
			}
		}, false);
	}

  const showCortana = (invoked, allowModelChange, actions) => {
		let model = selectedModel
    if (invoked && allowModelChange) {
			model = 'distracted'
      setSelectedModel('distracted')
    } else if (!invoked && allowModelChange) {
			model = 'converged'
      setSelectedModel('converged')
    }

    actions.handleMicClick({ getLuisResponse: actions.getLuisResponse, model })
		setShowCortanaPanel(true)
		
		console.log('showCortana:', invoked, allowModelChange, selectedModel)
  }

	useEffect(() => {
		if (window.DeviceOrientationEvent) {
			if (getMobileOperatingSystem() != 'iOS') {
				initSensor()
			}
		} else {
			console.error('Cannot find window.DeviceOrientationEvent')
		}
	}, [])

	useEffect(() => {
		if (
			sttState === null ||
			sttState === 'RecognitionEndedEvent' ||
			sttState === 'SpeechDetailedPhraseEvent') {
			setIsMicOn(false)
		} else {
			setIsMicOn(true)
		}
	}, [ sttState ])

	useEffect(() => {
		if (showCortanaPanel) {
			setCortanaText(defaultCortanaText)
		}
	}, [showCortanaPanel])

	return (
		<GlobalContext.Provider value={{
			avatarState, setAvatarState,
			sttState, setSttState,
			showMic, setShowMic,
			showUtterance, setShowUtterance,
			utterance, setUtterance,
			showCortanaPanel, setShowCortanaPanel,
			luisResponse, setLuisResponse,
			cortanaText, setCortanaText,
			showTeamsChat, setShowTeamsChat,
			chatMessages, setChatMessages,
			chatData, setChatData,
			showSettings, setShowSettings,
			fullAttentionMode, setFullAttentionMode,
			peopleData, setPeopleData,
			playTts, setPlayTts,
			selectedModel, setSelectedModel,
			showInstructions, setShowInstructions,
			shouldDisambig, setShouldDisambig,
			shouldSendMessage, setShouldSendMessage,
			showDisambig, setShowDisambig,
			userGeneratedInvocation, setUserGeneratedInvocation,
			voiceInvocation, setVoiceInvocation,
			isMicOn,
			resetCortana,
			orientation,
			initSensor,
			appendMessageToChatData,
			showCortana
		}}>
			{props.children}
		</GlobalContext.Provider>
	)

}

export default GlobalContextProvider