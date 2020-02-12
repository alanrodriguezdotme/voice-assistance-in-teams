import React, { useState, createContext } from 'react'

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

	return (
		<GlobalContext.Provider value={{
			avatarState, setAvatarState,
			sttState, setSttState,
			showMic, setShowMic,
			showUtterance, setShowUtterance,
			utterance, setUtterance,
			showCortanaPanel, setShowCortanaPanel,
			luisResponse, setLuisResponse,
			cortanaText, setCortanaText
		}}>
			{props.children}
		</GlobalContext.Provider>
	)

}

export default GlobalContextProvider