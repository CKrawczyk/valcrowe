import React from 'react';
import { Tab, Tabs, Grid, Row, Col, Well } from 'react-bootstrap';
import PlotSet from './plotSet';

const App = () => (
  <Grid>
    <Row>
      <Col xs={12}>
        <Well>
          Header goes here
        </Well>
      </Col>
    </Row>
    <Row>
      <Col xs={3}>
        <Well>
          Filter Area
        </Well>
      </Col>
      <Col xs={8}>
        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
          <Tab eventKey={1} title="Location">
            <PlotSet category="Lo" />
          </Tab>
          <Tab eventKey={2} title="Quiz">
            <PlotSet category="Qu" />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  </Grid>
);

export default App;
