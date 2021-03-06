import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { GlobalContext } from '../contexts/GlobalContext'
import Home from './Home'

const Wrapper = ({ tts }) => {
	let { orientation } = useContext(GlobalContext)

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

	return (
		<Container>
			<Home
				tts={ tts } 
				orientation={ orientation } 
				os={ getMobileOperatingSystem() } />
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