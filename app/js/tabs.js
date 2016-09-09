import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

const Tabs = () => (
  <Nav bsStyle="tabs" activeKey={1} stacked>
    <IndexLinkContainer to={{ pathname: '/' }}>
      <NavItem eventKey={1}>Home</NavItem>
    </IndexLinkContainer>
    <LinkContainer to={{ pathname: '/Lo' }}>
      <NavItem eventKey={2}>Location</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/PE' }}>
      <NavItem eventKey={3}>Protective and Enhancement</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Va' }}>
      <NavItem eventKey={4}>Values</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Ca' }}>
      <NavItem eventKey={5}>Career</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Un' }}>
      <NavItem eventKey={6}>Understanding</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/WL' }}>
      <NavItem eventKey={7}>Work or Leisure</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/So' }}>
      <NavItem eventKey={8}>Social</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/RC' }}>
      <NavItem eventKey={9}>Relative Contribution</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Co' }}>
      <NavItem eventKey={10}>Competitiveness</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/SC' }}>
      <NavItem eventKey={11}>Social Capital</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Qu' }}>
      <NavItem eventKey={12}>Quizes</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/In' }}>
      <NavItem eventKey={13}>Individual</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Em' }}>
      <NavItem eventKey={14}>Employment</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Ed' }}>
      <NavItem eventKey={15}>Education</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Ti' }}>
      <NavItem eventKey={16}>Time</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/FF' }}>
      <NavItem eventKey={17}>Friends and Family</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Re' }}>
      <NavItem eventKey={18}>Religion</NavItem>
    </LinkContainer>
    <LinkContainer to={{ pathname: '/Users' }}>
      <NavItem eventKey={18}>Users</NavItem>
    </LinkContainer>
  </Nav>
);

export default Tabs;
