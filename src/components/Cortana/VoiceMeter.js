import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import classNames from 'classnames'

const VoiceMeter = ({ sttState, color = '#333' }) => {
	let [isAnimationVisible, setIsAnimationVisible] = useState(true)

	useEffect(() => {
		switch (sttState) {
			case 'RecognitionTriggeredEvent':
				setIsAnimationVisible(true)
				break
			case 'SpeechHypothesisEvent':
				setIsAnimationVisible(true)
				renderSpeechAnimation()
				break
			case 'SpeechDetailedPhraseEvent':
				setIsAnimationVisible(false)
				break
		}
	}, [sttState])

	const renderSpeechAnimation = () => {
		let animationNodes = [
			{
				size: "xs",
				delay: 0
			},
			{
				size: "s",
				delay: 2
			},
			{
				size: "m",
				delay: .8
			},
			{
				size: "l",
				delay: 2.2
			},
			{
				size: "m",
				delay: 1.7
			},
			{
				size: "s",
				delay: 1
			},
			{
				size: "xs",
				delay: 2.2
			},
			{
				size: "s",
				delay: .8
			},
			{
				size: "m",
				delay: 1.4
			},
			{
				size: "l",
				delay: 2.6
			},
			{
				size: "xl",
				delay: .2
			},
			{
				size: "l",
				delay: .7
			},
			{
				size: "m",
				delay: .4
			},
			{
				size: "s",
				delay: 2.3
			},
			{
				size: "xs",
				delay: 1.5
			},
			{
				size: "s",
				delay: .3
			},
			{
				size: "m",
				delay: .1
			},
			{
				size: "l",
				delay: 0
			},
			{
				size: "m",
				delay: 2
			},
			{
				size: "s",
				delay: 2.2
			},
			{
				size: "xs",
				delay: 0
			},
		]

		return animationNodes.map((nodes, index) => {
			let animationNode = classNames('speechAnimation-node', {
				'speechAnimation-node--xs': isAnimationVisible && nodes.size == 'xs',
				'speechAnimation-node--s': isAnimationVisible && nodes.size == 's',
				'speechAnimation-node--m': isAnimationVisible && nodes.size == 'm',
				'speechAnimation-node--l': isAnimationVisible && nodes.size == 'l',
				'speechAnimation-node--xl': isAnimationVisible && nodes.size == 'xl',
			});

			let randomValue = Math.random() + .8;

			return (
				<div className="speechAnimation-floatingContainer" key={"nd" + index} style={{animationDelay: nodes.delay + 's'}}>
					<div className={animationNode} style={{ transform: "scaleY(" + randomValue + ")" }}></div>
				</div>
			)
		})
	}

	return (
		<Container color={ color }>
			{ renderSpeechAnimation() }
		</Container>
	)
}

export default VoiceMeter

function randomNum(min, max) {
	let r = Math.random()
	let randomNumber = min + Math.floor(r * ((max - min) + 1))
	return randomNumber
}

const float = keyframes`
	0% { transform: translatey(4px); }
	50% {	transform: translatey(-4px); }
	100% { transform: translatey(4px); }
`

const changeHeightXS = keyframes`
	0% { height: 4px; }
	50% { height: ${randomNum(6,10) + 'px'}; }
	100% { height: 4px; }
`

const changeHeightS = keyframes`
	0% { height: 8px; }
	50% { height: ${randomNum(8,12) + 'px'}; }
	100% { height: 8px; }
`

const changeHeightM = keyframes`
	0% { height: 12px; }
	50% { height: ${randomNum(14,18) + 'px'}; }
	100% { height: 12px; }
`

const changeHeightL = keyframes`
	0% { height: 20px; }
	50% { height: ${randomNum(22, 26) + 'px'}; }
	100% { height: 20px; }
`

const changeHeightXL = keyframes`
	0% { height: 26px; }
	50% { height: ${randomNum(28, 32) + 'px'}; }
	100% { height: 26px; }
`

const Container = styled.div`
	margin-top: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 40px;
	position: absolute;
	margin: 0 auto;
	z-index: 200;

	.speechAnimation-node {
			width: 2px;
			background: ${ p => p.color };
			border-radius: 1px;
			margin: 0 2px;
			transition: transform 150ms ease-in-out, height 150ms cubic-bezier(.1, .69, .38, .9);
			height: 0;
			animation-iteration-count: infinite;
			animation-timing-function: cubic-bezier(.1, .69, .38, .9);

			&--xs {
					height: 4px;
					animation-name: ${changeHeightXS};
					animation-duration: ${randomNum(765, 1111) + 'ms'};
			}

			&--s {
					height: 9px;
					animation-name: ${changeHeightS};
					animation-duration: ${randomNum(888, 1200) + 'ms'};
			}

			&--m {
					height: 12px;
					animation-name: ${changeHeightM};
					animation-duration: ${randomNum(697, 1100) + 'ms'};
			}

			&--l {
					height: 20px;
					animation-name: ${changeHeightL};
					animation-duration: ${randomNum(750, 1138) + 'ms'};
			}

			&--xl {
					height: 26px;
					animation-name: ${changeHeightXL};
					animation-duration: ${randomNum(805, 1000) + 'ms'};
			}
	}
`
