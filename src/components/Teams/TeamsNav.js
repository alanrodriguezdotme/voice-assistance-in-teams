import React, { useContext } from 'react'
import styled from 'styled-components'

const TeamsNav = () => {

  return (
    <Container>
      <NavItem selected={true}>
        <i className="icon-teams-regular icon-teams-Bell" />
        <div className="title">Activity</div>
      </NavItem>
      <NavItem>
        <i className="icon-teams icon-teams-Chat" />
        <div className="title">Chat</div>
      </NavItem>
      <NavItem>
        <i className="icon-teams icon-teams-Teams" />
        <div className="title">Teams</div>
      </NavItem>
      <NavItem>
        <i className="icon-teams icon-teams-Calendar" />
        <div className="title">Meetings</div>
      </NavItem>
      <NavItem>
        <i className="icon-teams icon-teams-More" />
        <div className="title">More</div>
      </NavItem>
    </Container>
  )
}

export default TeamsNav

const Container = styled.div`
  width: 100%;
  height: 50px;
  box-shadow: 0 0 3px 0 rgba(0,0,0,0.11), 0 0 3px 0px rgba(0,0,0,0.13);
  display: flex;
  align-items: center;
  justify-content: center;
`

const NavItem = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${ p => p.selected ? "#6264a7" : "#605e5c" };

  .icon-teams,
  .icon-teams-regular { 
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .title {
    font-size: 10px;
    margin: 3px 0 5px;
    height: 12px;
  }
`