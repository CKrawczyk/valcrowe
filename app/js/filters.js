import React from 'react';
import { Row, Col, Well, FormControl, Checkbox, Button, Collapse, Glyphicon } from 'react-bootstrap';
import Spinner from 'react-spinkit';
import Csv from './csv';

const GtLtFilter = (props) => (
  <Col {...props.bs} className="filter">
    <Row>
      <Col xs={12} className="filter__name">
        {props.text}
        <hr />
      </Col>
    </Row>
    <Row>
      <Col xs={6} className="input__min">
        <FormControl
          type="number"
          name={`${props.query}__gte`}
          value={props.filterState[`${props.query}__gte`]}
          onChange={props.handleChange}
          placeholder="Min"
        />
      </Col>
      <Col xs={6} className="input__max">
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
  /* eslint guard-for-in: 0 */
  /* eslint no-restricted-syntax: 0 */
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
  In: 'International',
};

const Filters = (props) => {
  let showHide = 'Show';
  let icon = <Glyphicon glyph="chevron-down" />;
  if (props.open) {
    showHide = 'Hide';
    icon = <Glyphicon glyph="chevron-up" />;
  }
  let inner = <Spinner noFadeIn />;
  if (!props.busy) {
    inner = `Showing ${props.count} out of 1913 responses`;
  }
  let csv;
  let footnote;
  if (props.csv) {
    csv = <Csv bs={{ xs: 3 }} categoryID={props.categoryID} query={props.query} />;
    footnote = (
      <Col xs={12}>
        <div className="home__center">Click any figure's title to compare that figure across different filter sets</div>
      </Col>
    );
  }
  let className = 'filters';
  if (props.className) {
    className = `filters${props.className}`;
  }
  let openButton;
  if (props.toggleOpen) {
    openButton = <Button block onClick={props.toggleOpen} bsSize="xsmall">{showHide} filters {icon}</Button>;
  }
  return (
    <Col xs={12}>
      <Well bsSize="small" className={className}>
        <Row>
          <Col xs={3}>
            {openButton}
          </Col>
          <Col xs={6} className="filters__count">
            {inner}
          </Col>
          {csv}
          {footnote}
        </Row>
        <Collapse in={props.open}>
          <div>
            <Row>
              <Col xs={12} className="filters__title">
                User filters:
              </Col>
              <Col sm={6} md={4}>
                <Row>
                  <GtLtFilter {...props} query="answer_set__user__total_n_classifications" text="Classification Count" bs={{ xs: 12 }} />
                </Row>
                <Row>
                  <GtLtFilter {...props} query="answer_set__user__talk_posts" text="Talk Post" bs={{ xs: 12 }} />
                </Row>
              </Col>
              <CheckboxFilter {...props} query="answer_set__user__survey_project__project__in" text="Home Project" options={surveyProject} bs={{ sm: 6, md: 4 }} />
              <CheckboxFilter {...props} query="answer_set__user__country__in" text="Country" options={country} bs={{ sm: 6, md: 4 }} />
            </Row>
            <Row>
              <Col xs={4} xsOffset={4}>
                <Button block onClick={props.onSubmit}>Apply filters</Button>
              </Col>
            </Row>
          </div>
        </Collapse>
      </Well>
    </Col>
  );
};

Filters.propTypes = {
  onSubmit: React.PropTypes.func,
  toggleOpen: React.PropTypes.func,
  count: React.PropTypes.number,
  open: React.PropTypes.bool,
  busy: React.PropTypes.bool,
  csv: React.PropTypes.bool,
  categoryID: React.PropTypes.string,
  query: React.PropTypes.object,
  className: React.PropTypes.string,
};

export default Filters;
