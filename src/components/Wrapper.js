import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { GlobalContext } from '../contexts/GlobalContext'
import { SpeechToTextContext } from '../contexts/SpeechToTextContext'
import Home from './Home'

const Wrapper = () => {
	let { initStt } = useContext(SpeechToTextContext)
	let { orientation } = useContext(GlobalContext)
	
	useEffect(() => {
		initStt()
	}, [])

	useEffect(() => {
		console.log(orientation)
	}, [orientation])

	return (
		<Container>
			<Home orientation={ orientation } />
		</Container>
	);
}
 
export default Wrapper;

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	background: #212121;
	display: flex;
	align-items: center;
	justify-content: center;
`