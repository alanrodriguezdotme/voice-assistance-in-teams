import React, { useState, useContext } from 'react'
import styled from 'styled-components'
import UserPhoto from '../UserPhoto'

import { SpeechToTextContext } from '../../contexts/SpeechToTextContext'
import { LuisContext } from '../../contexts/LuisContext'

const TeamsHeader = () => {
  let [ searchValue, setSearchValue ] = useState('')
  const { handleMicClick, recognizerStop } = useContext(SpeechToTextContext)
  const { getLuisResponse } = useContext(LuisContext)

  const handleMicrophoneClick = () => {
    handleMicClick(getLuisResponse)
  }

  return (
    <Container>
      <Top>
        <UserPhoto
          size={32}
          photo="profilePic1.png"
          firstName="Kat"
          lastName="Larsson" />
        <Title>Feed</Title>
        <TopButton>
          <i className="icon-teams icon-teams-Filter" />
        </TopButton>
      </Top>
      <Search>
        <SearchIcon>
          <i className="icon-teams icon-teams-Search" />
        </SearchIcon>
        <SearchInput
          placeholder="Search"
          value={ searchValue }
          onChange={ (event) => setSearchValue(event.target.value) } />
        <SearchButton onClick={ () => handleMicrophoneClick() }>
          <i className="icon-teams icon-teams-Microphone" />
        </SearchButton>
      </Search>
    </Container>
  )
}

export default TeamsHeader

const Container = styled.div`
  width: 100%;
  height: 96px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0.15px 0.45px 0px rgba(0, 0, 0, 0.11), 0px 0.8px 1.8px 0px rgba(0, 0, 0, 0.13);

  .icon-teams::before {
    text-align: center;
  }

  .userPhoto {
    margin-right: 8px;
  }
`

const Top = styled.div`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 0 16px;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 26px;
  color: #11100f;
  flex: 1;
`

const TopButton = styled.div`
  width: 32px;
  height: 32px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Search = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  margin: 10px 0 8px 0;
  padding: 0 16px 0 16px;
`

const SearchIcon = styled.div`
  background: #f4f4f4;
  width: 32px;
  font-size: 16px; 
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px 0 0 10px;
  color: #979593;
`

const SearchInput = styled.input`
  background: #f4f4f4;
  border: 0;
  font-size: 17px;
  flex: 1;
`

const SearchButton = styled.div`
  background: #f4f4f4;
  width: 48px;
  border-left: 2px solid white;
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px; 
  color: #6264a7;
`