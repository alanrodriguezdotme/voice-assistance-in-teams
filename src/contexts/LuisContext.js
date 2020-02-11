import React, { useContext, createContext, useEffect } from 'react'
import Speech from 'speak-tts'

import { GlobalContext } from '../contexts/GlobalContext'
import { SpeechToTextContext } from './SpeechToTextContext'

export const LuisContext = createContext()

const speech = new Speech()

const LuisContextProvider = (props) => {
	let { setLuisResponse } = useContext(GlobalContext)
	let { handleMicClick, recognizerStop, initStt } = useContext(SpeechToTextContext)

	const resetLuis = () => {        
	//completely reset the demo
	  recognizerStop()
	  initStt()
	}

	const finishFlow = () => {        
		var audio = new Audio('assets/earcons/earconSuccess.wav');
		setTimeout(() => {
			audio.play();
			setTimeout(() => {
				resetLuis()
			}, 2000)
		}, 1500)
	}

	const getName = (string) => {
		var splitString = string.toLowerCase().split(' ')
		for (var i = 0; i < splitString.length; i++) {
			splitString[i] = splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1)
		}
		let firstName = splitString[0]
		let lastName = splitString[1]

		console.log('getName: ', firstName, lastName)

		return { firstName, lastName }
	}

	const speak = (text, openMicAgain, followUp, actions) => {
		speech.speak({
			text,
			queue: false,
			listeners: {
				onstart: () => {
					if (followUp && !pauseAfterTts) { followUp(actions) }
					console.log("Start utterance")
				},
				onend: () => {
					if (followUp && pauseAfterTts) { followUp(actions) }
					if (openMicAgain) {
						handleMicClick({getLuisResponse})
					}
					console.log("End utterance")
				}
			}
		})
		.catch(err => {
			console.error(err)
		})
	}

	const getLuisResponse = (utterance, actions) => {
		// Alan's LUIS account
		const LUIS_URL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/fa57ed98-f410-4b0e-a8ab-bc34b697e199?verbose=true&timezoneOffset=0&subscription-key=7b66646eb6344aea8e22592a102bcc6d&q='
		let scrubbedUtterance = utterance[0] == '"' ? utterance.substring(1, utterance.length - 1).toLowerCase() : utterance.toLowerCase() // remove quotes from utterance
		
		return new Promise((resolve, reject) => {
			fetch(LUIS_URL + scrubbedUtterance)
				.then((response) => {
					return response.json()
				})
				.then((data) => {
					setLuisResponse(data)
					let intent = data.intents[0].intent
					let confidenceScore = data.intents[0].confidenceScore
					
					if (intent) {
						console.log('intent: ', intent)
						//check and see if we confidently know the intent, otherwise it is freeform text.
						if (confidenceScore > .6) {
							switch(intent) {
								case 'callPerson':
									console.log('intent: callPerson')
									
									break
								
								case 'triggerMessageSkill':	
									console.log('intent: triggerMessageSkill')

									break

								default:
									console.log('no actions found for this intent: ' + intent)

									break
							}
						}
					}

					resolve(data);
				})
				.catch((err) => {
					console.error(err)
					reject(err);
				});

		});
	}

	const setProfile = (utterance, type, skill, actions) => {
		console.log('setProfile:', utterance)
		//set the corresponding profile depending on phrase spoken
		if (utterance.includes('smith') || utterance.includes('first')) {		
			actions.setAdaptiveCardContent({
				type, skill,
				firstName: cardContent.firstName,
				lastName: cardContent.lastName ? cardContent.lastName : "Smith",
				picture: "assets/profilePic1.png",
				message: null
			})
		}
		else if (utterance.includes('jones') || utterance.includes('second') || utterance.includes('middle')) {	
			actions.setAdaptiveCardContent({
				type, skill,
				firstName: cardContent.firstName,
				lastName: cardContent.lastName ? cardContent.lastName : "Jones",
				picture: "assets/profilePic2.png",
				message: null
			})
		}
		else if (utterance.includes('johnson') || utterance.includes('third') || utterance.includes('last')) {	
			actions.setAdaptiveCardContent({
				type, skill,
				firstName: cardContent.firstName,
				lastName: cardContent.lastName ? cardContent.lastName : "Johnson",
				picture: "assets/profilePic3.png",
				message: null
			})
		}
		else {	
			actions.setAdaptiveCardContent({
				type, skill,
				firstName: cardContent.firstName,
				lastName: cardContent.lastName ? cardContent : "Smith",
				picture: "assets/profilePic1.png",
				message: null
			})
		}
		actions.setShowAdaptiveCard(true)
	}

	return (
		<LuisContext.Provider value={{ getLuisResponse, resetLuis }}>
			{ props.children }
		</LuisContext.Provider>
	)
}

export default LuisContextProvider