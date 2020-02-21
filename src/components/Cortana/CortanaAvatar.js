import React from 'react'
import styled, { keyframes } from 'styled-components'
import classNames from 'classnames'

const CortanaAvatar = ({ state = 'calm', outerColor = '#B0B1D3', innerColor = '#6264A7', size='large', image="profilePic3.png" }) => {
	let cortanaOuter = classNames('cortanaLogo-outerRing cortanaLogo-outerRing--calm', {
		'cortanaLogo-outerRing--listening': state == 'listening',
		'cortanaLogo-outerRing--thinking': state == 'thinking',
		'cortanaLogo-outerRing--speaking': state == 'speaking',
	})

	let cortanaInner = classNames('cortanaLogo-innerRing cortanaLogo-innerRing--calm', {
		'cortanaLogo-innerRing--listening': state == 'listening',
		'cortanaLogo-innerRing--thinking': state == 'thinking',
		'cortanaLogo-innerRing--speaking': state == 'speaking',
	})

	function renderImage() {
		if (image) {
			return (
				<Image image={ image } />
			)
		}
	}

	return (
		<Container
			className={size}
			outerColor={outerColor}
			innerColor={innerColor}
			size={size}>
			{ image && renderImage() }
			<div className={cortanaOuter}></div>
			<div className={cortanaInner}></div>
		</Container>
	)
}

export default CortanaAvatar

const fadeIn = keyframes`
	0% {
			opacity: 0;
			transform: scale(0);
	}

	100% {
			opacity: 1;
			transform: translate(1);
	}
`

const calmOuter = keyframes`
	0% { transform: scale(.9); }
	50% { transform: scale(1); }
	100% { transform: scale(.9); }
`

const calmInner = keyframes`
	0% { transform: scale(.9); }
	50% { transform: scale(1); }
	100% { transform: scale(.9); }
`

const listeningOuter = keyframes`
	0% { transform: scale(.9); }
	50% { transform: scale(1); }
	100% { transform: scale(.9); }
`
const listeningInner = keyframes`
	0% { transform: scale(.6); }
	50% {	transform: scale(.8); }
	100% { transform: scale(.6);	}
`

const thinking = keyframes`
	0% { transform: scaleX(1); }
	50% { transform: scaleX(0); }
	100% { transform: scaleX(1); }
`

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200px;

	animation: ${fadeIn} 350ms ease-in-out;
	animation-fill-mode: forwards;

	.cortanaLogo-outerRing {
		height: ${ p => p.size == 'large' ? '192px' : '48px' };
		width: ${ p => p.size == 'large' ? '192px' : '48px' };
		background: ${ p => p.outerColor };
		border-radius: 100%;
		transition: all 350ms ease-in-out;

		&--calm {
			animation: ${calmOuter} 6s ease-in-out;
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
		}

		&--thinking {
			animation: ${thinking} 1s ease-in-out;
			animation-delay: 500ms;
			background: transparent;
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
			border: 12px solid ${ p => p.outerColor };
			height: ${ p => p.size == 'large' ? '192px' : '42px' };
			width: ${ p => p.size == 'large' ? '192px' : '42px' };
		}

		&--listening {
			animation: ${listeningOuter} 1s ease-in-out;
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
		}

		&--speaking {
			animation: ${listeningOuter} .5s ease-in-out;
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
		}
	}

	.cortanaLogo-innerRing {
		height: ${ p => p.size == 'large' ? '151px' : '32px' };
		width: ${ p => p.size == 'large' ? '151px' : '32px' };
		border: 3px solid ${ p => p.innerColor};
		border-width: ${ p => p.size == 'large' ? '12px' : '3px' };
		background: #faf9f8;
		border-radius: 100%;
		transition: all 350ms ease-in-out;
		position: absolute;
		animation-delay: 1s;
		z-index: 200;

		&--calm {
			animation: ${calmInner} 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
		}

		&--thinking {
			animation: ${thinking} 1s ease-in-out;
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
			background: transparent;
			border-width: ${ p => p.size == 'large' ? '12px' : '3px' };
			height: ${ p => p.size == 'large' ? '151px' : '32px' };
			width: ${ p => p.size == 'large' ? '151px' : '32px' };
		}

		&--listening {
			animation: ${listeningInner} 1s ease-in-out;
			background: ${ p => p.innerColor};
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
		}

		&--speaking {
			animation: ${listeningInner} .5s ease-in-out;
			background: ${ p => p.innerColor};
			animation-fill-mode: forwards;
			animation-iteration-count: infinite;
		}
	}
`

const Image = styled.div`
	height: 130px;
	width: 130px;
	background-image: ${ p => p.image ? 'url("assets/' + p.image + '")' : null };
	background-position: center;
	background-size: contain;
	border-radius: 115px;
	position: absolute;
	z-index: 1000;
`