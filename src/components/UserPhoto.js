import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const UserPhoto = ({ size, photo, firstName, lastName }) => {
  let colors = [
    "FFB900",
    "E74856",
    "0078D7",
    "0099BC",
    "4C4A48",
    "8764B8"
  ]
  let [ selectedColor, setSelectedColor ] = useState(null)

  useEffect(() => {
    setSelectedColor(colors[Math.floor(Math.random() * colors.length)])
  }, [])

  const renderInitials = () => {
    let initials = firstName[0] + lastName[0]
    return (
      <Initials size={ size } >
        { initials.toUpperCase() }
      </Initials>
    )
  }

  return (
    <Container
      className="userPhoto"
      backgroundColor={ selectedColor ? selectedColor: 'transparent' }
      size={ size }
      photo={ photo }>
      { !photo && renderInitials() }
    </Container>
  )
}

export default UserPhoto

const Container = styled.div`
  width: ${ p => p.size + 'px' };
  height: ${ p => p.size + 'px' };
  border-radius: ${ p => (p.size / 2) + 'px' };
  background-color: ${ p => "#" + p.backgroundColor };
  background-image: ${ p => p.photo ? 'url("assets/' + p.photo + '")' : null };
  background-size: cover;
  background-position: center center;
`

const Initials = styled.div`
  width: 100%;
  height: 100%;
  color: white;
  font-size: ${ p => (p.size * .35) + 'px' };
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
`