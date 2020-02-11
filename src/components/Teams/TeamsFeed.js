import React from 'react'
import styled from 'styled-components'
import { format, subMinutes, formatDistanceToNow } from 'date-fns'

import TeamsFeedData from '../../contexts/TeamsFeedData' 
import UserPhoto from '../UserPhoto'

const TeamsFeed = () => {
  function renderTimestamp(timeOffset) {
    let time = subMinutes(new Date(), timeOffset)
    console.log(time)
    console.log(format(time))
    return formatDistanceToNow(time)
  }

  const renderFeed = () => {
    return TeamsFeedData.map((item, index) => {
      return (
        <Item key={ 'feedItem' + index }>
          <Left>
            <UserPhoto
              size={44}
              photo={ item.photo }
              firstName={ item.firstName }
              lastName={ item.lastName } />
          </Left>
          <Right>
            <TitleLine>
              <TitleIcon iconColor={ item.iconColor }>
                <i className={ "icon-teams icon-teams-" + item.icon } />
              </TitleIcon>
              <Title>
                { item.firstName + ' ' + item.title }
              </Title>
              <Timestamp>
                {/* { item.timeOffset && renderTimestamp(item.timeOffset) } */}
              </Timestamp>
            </TitleLine>
            <SubtitleLine>
              <Subtitle>
                { item.subtitle }
              </Subtitle>
            </SubtitleLine>
            <DescriptionLine>
              <Description>
                { item.description }
              </Description>
            </DescriptionLine>
          </Right>
        </Item>
      )
    })
  }
  
  return (
    <Container>
      { renderFeed() }
    </Container>
  )
}

export default TeamsFeed

const Container = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  color: #11100f;
`

const Item = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
`

const Left = styled.div`
  width: 72px;
  padding: 16px 12px 30px 16px;
`

const Right = styled.div`
  flex: 1;
  border-bottom: 1px solid #e1dfdd;
`

const TitleLine = styled.div`
  display: flex;
  height: 18px;
  margin: 16px 0 2px 0;
`

const TitleIcon = styled.div`
  color: ${ p => p.iconColor };
  padding-right: 8px;
  font-size: 16px;
`

const Title = styled.div`
  flex: 1;
  font-size: 15px;
`

const Timestamp = styled.div`

`

const SubtitleLine = styled.div`
  height: 18px;
  margin: 2px 0;
`

const Subtitle = styled.div`
  color: #605e5c;
  font-size: 15px;
`

const DescriptionLine = styled.div`
  max-width: 284px;
  height: 18px;
  margin: 2px 0 16px 0;
`

const Description = styled.div`
  width: 100%;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 15px;
  color: #484644;
`