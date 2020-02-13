import React from 'react'

import GlobalContextProvider from './contexts/GlobalContext'
import Wrapper from './components/Wrapper'
import SpeechToTextContextProvider from './contexts/SpeechToTextContext'
import LuisContextProvider from './contexts/LuisContext'
// import BrowserSTTContextProvider from './contexts/BrowserSTTContext'

const App = () => {
	return (
		<GlobalContextProvider>
			<SpeechToTextContextProvider>
				{/* <BrowserSTTContextProvider> */}
					<LuisContextProvider>
						<Wrapper />
					</LuisContextProvider>
				{/* </BrowserSTTContextProvider> */}
			</SpeechToTextContextProvider>
		</GlobalContextProvider>
	);
}
 
export default App