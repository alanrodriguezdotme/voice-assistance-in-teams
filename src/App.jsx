import React from 'react'

import GlobalContextProvider from './contexts/GlobalContext'
import Wrapper from './components/Wrapper'
import LuisContextProvider from './contexts/LuisContext'
import TextToSpeech from './contexts/TextToSpeech'
import STTContextProvider from './contexts/STTContext'
// import BrowserSTTContextProvider from './contexts/BrowserSTTContext'

const App = () => {	
	let tts = new TextToSpeech(process.env.ACCESS_TOKEN)
	
	return (
		<GlobalContextProvider>
			<STTContextProvider>
				<LuisContextProvider tts={ tts }>
					<Wrapper tts={ tts } />
				</LuisContextProvider>
			</STTContextProvider>
		</GlobalContextProvider>
	);
}
 
export default App