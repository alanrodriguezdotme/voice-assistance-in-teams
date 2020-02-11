import React, { useContext } from 'react'
import styled from 'styled-components'

import { GlobalContext } from '../contexts/GlobalContext'
import { SpeechToTextContext } from '../contexts/SpeechToTextContext'
import Home from './Home'

const Wrapper = () => {

	return (
		<Container>
			<Home />
		</Container>
	);
}
 
export default Wrapper;

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	background: #333;
	display: flex;
	align-items: center;
	justify-content: center;
`