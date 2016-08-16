import React from 'react';
import { Grid, Row, Col, Well } from 'react-bootstrap';
import Tabs from './tabs';

const App = (props) => (
  <Grid>
    <Row>
      <Col xs={12}>
        <Well>
          Header goes here
        </Well>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <Well>
          Filters go here
        </Well>
      </Col>
    </Row>
    <Row>
      <Col xs={2}>
        <div className="sidebar">
          <Tabs />
        </div>
      </Col>
      <Col xs={10}>
        {props.children}
      </Col>
    </Row>
  </Grid>
);

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
