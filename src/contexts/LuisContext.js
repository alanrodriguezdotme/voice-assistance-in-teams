import React, { useContext, createContext, useEffect } from 'react'
import Speech from 'speak-tts'
import * as _ from 'underscore'

import { GlobalContext } from '../contexts/GlobalContext'
import { SpeechToTextContext } from './SpeechToTextContext'

export const LuisContext = createContext()

const speech = new Speech()
let newChatData = null

const LuisContextProvider = (props) => {
	let { setLuisResponse, setShowTeamsChat, resetCortana, setChatData, setShouldSendMessage, setCortanaText, chatData, playTts, shouldDisambig, setShowDisambig, selectedModel } = useContext(GlobalContext)
	let { handleMicClick, recognizerStop, initStt } = useContext(SpeechToTextContext)
	let { tts } = props

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

		if (!lastName) {
			lastName = shouldDisambig ? null : 'Jamil' 
		}

		console.log('getName: ', firstName, lastName)

		return { firstName, lastName }
	}

	const sendMessage = () => {		
		setCortanaText({ title: 'Sending...' })
		setTimeout(() => {
			setShouldSendMessage(true)
			setCortanaText({ title: "I've sent this." })
			if (playTts) {
				tts.speak("Sent", () => {
					resetCortana()
					recognizerStop()
				})
			} else {
				setTimeout(() => {
					resetCortana()
					recognizerStop()
				}, 2000)
			}
		}, 2000)
	}

	const disambigLastName = (utterance) => {
		if (utterance.includes('first') || utterance.includes('top') || utterance.includes('bennett')) {
			newChatData.lastName = 'Bennett'
			newChatData.photo = 'profilePic3.png'
			return
		}

		if (utterance.includes('second') || utterance.includes('last') || utterance.includes('jiang')) {
			newChatData.lastName = 'Jiang'
			return
		}
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
					let { intent, score } = data.intents[0]
					let { entities } = data

					if (intent) {
						console.log('intent: ', intent)
						console.log(data)
						let personName = null
						let message = null

						if (entities.length > 0) {
							let personNameObject = _.findWhere(entities, {
								type: 'builtin.personName'
							})
							let messageObject = _.findWhere(entities, {
								type: 'message'
							})

							if (personNameObject) {
								personName = personNameObject && personNameObject.entity
								newChatData = { ...getName(personName) }
							}

							if (messageObject) {
								message = messageObject.entity
								newChatData.message = message
							}
						}

						//check and see if we confidently know the intent, otherwise it is freeform text.
						if (score > .6) {
							console.log('intent: ' + intent)
							switch(intent) {
								case 'callPerson':
									break

								case 'decline':
									resetCortana(true)
									break

								case 'confirm':
									if (chatData.message) {
										sendMessage()
									}
									break

								case 'grabFullName':
									disambigLastName(scrubbedUtterance)
									break

								case 'triggerMessageSkill':
									console.log(newChatData)
									setChatData(newChatData)
									let fullName = newChatData.firstName + ' ' + newChatData.lastName

									if (shouldDisambig && !newChatData.lastName) {
										if (selectedModel === 'distracted') {
											setCortanaText({
												title: 'Which ' + newChatData.firstName + ' do you want to message?'
											})
											setShowDisambig(true)
											break
										}
										
										if (selectedModel === 'hybrid') {
											setShowTeamsChat(true)
										}
									}

									if (newChatData.message) {
										setCortanaText({
											title: fullName,
											subtitle: newChatData.message
										})
									} else {
										setCortanaText({
											title: "What's your message?",
											subtitle: null
										})
									}

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

	return (
		<LuisContext.Provider value={{ getLuisResponse, resetLuis, sendMessage }}>
			{ props.children }
		</LuisContext.Provider>
	)
}

export default LuisContextProvider