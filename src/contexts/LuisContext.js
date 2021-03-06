import React, { useContext, createContext, useEffect } from 'react'
import * as _ from 'underscore'

import { GlobalContext } from '../contexts/GlobalContext'
import UsersData from './UsersData'
import { STTContext } from './STTContext'

export const LuisContext = createContext()

let newChatData = null

const LuisContextProvider = (props) => {
	let { setLuisResponse, setShowTeamsChat, resetCortana, setChatData, setShouldSendMessage, setCortanaText, chatData, playTts, shouldDisambig, setShowDisambig, selectedModel } = useContext(GlobalContext)
	let { startListening, stopListening, initStt } = useContext(STTContext)
	let { tts } = props

	const resetLuis = () => {
	//completely reset the demo
	  stopListening()
		newChatData = null
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
					resetCortana(true)
					stopListening()
				})
			} else {
				setTimeout(() => {
					resetCortana(true)
					stopListening()
				}, 2000)
			}
		}, 1000)
	}

	const disambigLastName = (utterance) => {
		utterance = utterance.toLowerCase()
		if (utterance.includes('first') || utterance.includes('top') || utterance.includes('rogan')) {
			newChatData.lastName = UsersData[0].lastName
			newChatData.photo = UsersData[0].photo
		} else if (utterance.includes('second') || utterance.includes('middle') || utterance.includes('hall')) {
			newChatData.lastName = UsersData[1].lastName
			newChatData.photo = UsersData[1].photo
		} else if (utterance.includes('third') || utterance.includes('last') || utterance.includes('jackson')) {
			newChatData.lastName = UsersData[2].lastName
			newChatData.photo = UsersData[2].photo
		}

		setChatData({ ...newChatData })
		setShowDisambig(false)

		if (!newChatData.message) { askForMessage() }
		else { confirmSend(selectedModel) }
	}

	const askForMessage = (name) => {
		setCortanaText({
			title: "What's your message?",
			subtitle: null
		})

		if (name) {
			newChatData.lastName = name
			setChatData({ ...newChatData })
		}

		if (playTts) {
			tts.speak("What's your message for " + newChatData.firstName + ' ' + newChatData.lastName + '?', () => {
				startListening({ getLuisResponse, chatData: newChatData }, true)
			})
		} else {
			startListening({ getLuisResponse, chatData: newChatData }, true)
		}
	}

	const confirmSend = (model) => {
		console.log('confirmSend: ', selectedModel, model)
		setCortanaText({
			title: 'Do you want to send it?',
			subtitle: newChatData.message
		})

		if (playTts) {
			if (model === 'distracted') {
				tts.speak('Ok, sending a message to ' + newChatData.firstName + ' ' + newChatData.lastName + ' that says ' + newChatData.message + '. Send it?', () => {
					startListening({ getLuisResponse, chatData: newChatData }, false)
				})
			} else {
				tts.speak("Do you want to send it?", () => {
					startListening({ getLuisResponse, chatData: newChatData }, false)
				})
			}
		} else {
			startListening({ getLuisResponse, chatData: newChatData }, false)
		}
	}

	const disambig = () => {
		setShowDisambig(true)
		setCortanaText({
			title: "Which " + newChatData.firstName,
			subtitle: chatData.message
		})

		if (playTts) {
			tts.speak("Which " + newChatData.firstName, () => {
				startListening({ getLuisResponse, chatData: newChatData }, false)
			})
		} else {
			startListening({ getLuisResponse, chatData: newChatData }, false)
		}
	}

	const getLuisResponse = (utterance, actions) => {
		// LUIS endpoint goes here
		const LUIS_URL = 'INSERT_LUIS_ENDPOINT_URL'
		
		// remove quotes from utterance
		let scrubbedUtterance = utterance[0] == '"' ? 
			utterance.substring(1, utterance.length - 1).toLowerCase() : 
			utterance.toLowerCase() 

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

							console.log('newChatData:', newChatData)
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
									// if (newChatData.message) {
										sendMessage()
									// }
									break

								case 'grabFullName':
									console.log('grabFullName:', scrubbedUtterance)
									disambigLastName(scrubbedUtterance)
									break

								case 'triggerMessageSkill':
									console.log('newChatData:', newChatData)
									setChatData(newChatData)

									if (shouldDisambig) {

										// get last name
										if (!newChatData.lastName) {
											if (selectedModel === 'distracted') {
												disambig()
												break
											}

											if (selectedModel === 'converged') {
												setShowTeamsChat(true)
												disambig()
												break
											}
											// disambig()
											break

										// if lastName exists
										} else {
											if (!newChatData.message && selectedModel != 'full attention') {
												askForMessage()
											}
											else {
												if (selectedModel != 'full attention') {
													confirmSend(actions.model)
												} else {
													setChatData(newChatData)
													confirmSend(actions.model)
												}
											}
										}
									} else {
										if (selectedModel === 'distracted') {
											askForMessage('Jamil')
											break
										}
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
		<LuisContext.Provider value={{ getLuisResponse, resetLuis, sendMessage, askForMessage }}>
			{ props.children }
		</LuisContext.Provider>
	)
}

export default LuisContextProvider