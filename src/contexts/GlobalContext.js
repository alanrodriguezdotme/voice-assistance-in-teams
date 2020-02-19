import React, { useState, createContext, useEffect } from 'react'

import TeamsChatData from './TeamsChatData'

export const GlobalContext = createContext()

const GlobalContextProvider = (props) => {
	let [ avatarState, setAvatarState ] = useState('calm')
	let [ sttState, setSttState ] = useState(null)
	let [ showMic, setShowMic ] = useState(true)
	let [ showUtterance, setShowUtterance ] = useState(false)
	let [ utterance, setUtterance ] = useState(null)
	let [ showCortanaPanel, setShowCortanaPanel ] = useState(false)
	let [ luisResponse, setLuisResponse ] = useState(null)
	let [ cortanaText, setCortanaText ] = useState(null)
	let [ showTeamsChat, setShowTeamsChat ] = useState(false)
	let [ chatMessages, setChatMessages ] = useState(TeamsChatData)
	let [ chatData, setChatData ] = useState(null)
	let [ orientation, setOrientation ] = useState(null)
	let [ showSettings, setShowSettings ] = useState(false)
	let [ fullAttentionMode, setFullAttentionMode ] = useState(true)

	const resetCortana = () => {
		setSttState(null)
		setUtterance(null)
		setAvatarState('calm')
		setLuisResponse(null)
		setShowCortanaPanel(false)
		setChatData(null)
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

	useEffect(() => {
		if (window.DeviceOrientationEvent) {
			if (getMobileOperatingSystem() != 'iOS') {
				initSensor()
			}
		} else {
			console.error('Cannot find window.DeviceOrientationEvent')
		}
	}, [])

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
			resetCortana,
			orientation,
			initSensor
		}}>
			{props.children}
		</GlobalContext.Provider>
	)

}

export default GlobalContextProvider