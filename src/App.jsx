import React from 'react'

import GlobalContextProvider from './contexts/GlobalContext'
import Wrapper from './components/Wrapper'
import SpeechToTextContextProvider from './contexts/SpeechToTextContext'
import LuisContextProvider from './contexts/LuisContext'
import TextToSpeech from './contexts/TextToSpeech'
// import BrowserSTTContextProvider from './contexts/BrowserSTTContext'

const App = () => {	
	let tts = new TextToSpeech(process.env.ACCESS_TOKEN)
	
	return (
		<GlobalContextProvider>
			<SpeechToTextContextProvider>
				{/* <BrowserSTTContextProvider> */}
				<LuisContextProvider tts={ tts }>
					<Wrapper tts={ tts } />
				</LuisContextProvider>
				{/* </BrowserSTTContextProvider> */}
			</SpeechToTextContextProvider>
		</GlobalContextProvider>
	);
}
 
export default App