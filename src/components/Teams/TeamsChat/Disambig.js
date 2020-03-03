import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import UserPhoto from '../../UserPhoto'
import { GlobalContext } from '../../../contexts/GlobalContext'

const Disambig = ({ peopleData, recipientsValue }) => {
  let { setChatData, chatData } = useContext(GlobalContext)

  useEffect(() => {
    console.log(recipientsValue)
  }, [ recipientsValue ])

  function handleItemClick(person) {
    let data = { ...chatData }
    data.lastName = person.lastName
    data.photo = person.photo
    setChatData(data)
  }

  function renderPeople() {
    return peopleData.map((person, i) => {
      let { title, photo, lastName } = person

      return (
        <Item key={ 'item-' + i } onClick={ () => handleItemClick(person) }>
          <UserPhoto
            size={ 32 }
            photo={ photo }
            firstName={ recipientsValue }
            lastName={ lastName }
          />
          <Details>
            <Name>{ recipientsValue + ' ' + lastName }</Name>
            <Title>{ title }</Title>
          </Details>
        </Item>
      )
    })
  }

  return (
    <Container>
      <ListTitle>Suggestions</ListTitle>
      { renderPeople() }
    </Container>
  )
}

export default Disambig

const Container = styled.div`
  background: #eaeaea;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`

const ListTitle = styled.div`
  margin: 12px 12px;
  font-weight: bold;
  font-size: 18px;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px 12px;
  background: white;
  padding: 12px;
  cursor: pointer;
`

const Details = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 12px;
`

const Name = styled.div`

`

const Title = styled.div`
  color: #666;
  font-size: 13px;
  margin-top: 2px;
`