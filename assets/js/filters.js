import React from 'react';
import { Row, Col, Well, FormControl, Checkbox, Button } from 'react-bootstrap';

const GtLtFilter = (props) => (
  <Col {...props.bs} className="filter">
    <Row>
      <Col xs={12} className="filter__name">
        {props.text}
        <hr />
      </Col>
    </Row>
    <Row>
      <Col xs={6}>
        <FormControl
          type="number"
          name={`${props.query}__gte`}
          value={props.filterState[`${props.query}__gte`]}
          onChange={props.handleChange}
          placeholder="Min"
        />
      </Col>
      <Col xs={6}>
        <FormControl
          type="number"
          name={`${props.query}__lte`}
          value={props.filterState[`${props.query}__lte`]}
          onChange={props.handleChange}
          placeholder="Max"
        />
      </Col>
    </Row>
  </Col>
);

GtLtFilter.propTypes = {
  bs: React.PropTypes.object,
  text: React.PropTypes.string,
  query: React.PropTypes.string,
  filterState: React.PropTypes.object,
  handleChange: React.PropTypes.func,
};

const CheckboxFilter = (props) => {
  const options = [];
  for (const key in props.options) {
    const value = props.filterState[props.query][key];
    options.push(
      <Col xs={6} key={`${props.text}:${key}`}>
        <Checkbox
          name={`${props.query}.${key}`}
          onChange={props.handleChange}
          checked={value}
        >
          {props.options[key]}
        </Checkbox>
      </Col>
    );
  }
  return (
    <Col {...props.bs} className="filter">
      <Row>
        <Col xs={12} className="filter__name">
          {props.text}
          <hr />
        </Col>
      </Row>
      <Row>
        {options}
      </Row>
    </Col>
  );
};

CheckboxFilter.propTypes = {
  bs: React.PropTypes.object,
  text: React.PropTypes.string,
  query: React.PropTypes.string,
  options: React.PropTypes.object,
  filterState: React.PropTypes.object,
  handleChange: React.PropTypes.func,
};

const surveyProject = {
  GZ: 'Galaxy Zoo',
  PH: 'Planet Hunter',
  PW: 'Penguin Watch',
  SE: 'Seafloor Explorer',
  SS: 'Snapshot Serengeti',
};

const country = {
  US: 'United States',
  UK: 'United Kingdom',
  Ca: 'Canada',
  Au: 'Australia',
  Ge: 'Germany',
  Fr: 'France',
  Ne: 'Netherlands',
  Po: 'Poland',
  In: 'Internatinal',
};

const Filters = (props) => (
  <Col xs={12}>
    <Well bsSize="small">
      <Row>
        <Col xs={12} className="filters__title">
          User filters:
        </Col>
        <GtLtFilter {...props} query="user__total_n_classifications" text="Classification Count" bs={{ xs: 2 }} />
        <GtLtFilter {...props} query="user__talk_posts" text="Talk Post" bs={{ xs: 2 }} />
        <CheckboxFilter {...props} query="user__survey_project__project__in" text="Survey Project" options={surveyProject} bs={{ xs: 4 }} />
        <CheckboxFilter {...props} query="user__country__in" text="Country" options={country} bs={{ xs: 4 }} />
      </Row>
      <Row>
        <Col xs={4}>
          Showing {props.count} out of 1913 responses
        </Col>
        <Col xs={4}>
          <Button block onClick={props.onSubmit}>Apply filters</Button>
        </Col>
      </Row>
    </Well>
  </Col>
);

Filters.propTypes = {
  onSubmit: React.PropTypes.func,
  count: React.PropTypes.number,
};

export default Filters;
