import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Tabs from './tabs';
import { getStats } from './stats-api';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.getQuery = this.getQuery.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.toggleBusy = this.toggleBusy.bind(this);
    this.scrollPage = this.scrollPage.bind(this);
    this.state = {
      scrollX: 0,
      scrollY: 0,
      open: false,
      query: {},
      count: 1913,
      busy: false,
      userFilter: {
        answer_set__user__total_n_classifications__gte: '',
        answer_set__user__total_n_classifications__lte: '',
        answer_set__user__talk_posts__gte: '',
        answer_set__user__talk_posts__lte: '',
        answer_set__user__survey_project__project__in: {
          GZ: true,
          PH: true,
          PW: true,
          SE: true,
          SS: true,
        },
        answer_set__user__country__in: {
          US: true,
          UK: true,
          Ca: true,
          Au: true,
          Ge: true,
          Fr: true,
          Ne: true,
          Po: true,
          In: true,
        },
      },
    };
  }

  getQuery() {
    const surveyProject = [];
    /* eslint guard-for-in: 0 */
    /* eslint no-restricted-syntax: 0 */
    for (const key in this.state.userFilter.answer_set__user__survey_project__project__in) {
      if (this.state.userFilter.answer_set__user__survey_project__project__in[key]) {
        surveyProject.push(key);
      }
    }
    const country = [];
    for (const key in this.state.userFilter.answer_set__user__country__in) {
      if (this.state.userFilter.answer_set__user__country__in[key]) {
        country.push(key);
      }
    }
    const query = {
      ...this.state.userFilter,
      answer_set__user__survey_project__project__in: surveyProject,
      answer_set__user__country__in: country,
    };
    // clean up unneeded querys
    if (surveyProject.length === 5) {
      delete(query.answer_set__user__survey_project__project__in);
    }
    if (country.length === 9) {
      delete(query.answer_set__user__country__in);
    }
    if (query.answer_set__user__total_n_classifications__gte === '') {
      delete(query.answer_set__user__total_n_classifications__gte);
    }
    if (query.answer_set__user__total_n_classifications__lte === '') {
      delete(query.answer_set__user__total_n_classifications__lte);
    }
    if (query.answer_set__user__talk_posts__gte === '') {
      delete(query.answer_set__user__talk_posts__gte);
    }
    if (query.answer_set__user__talk_posts__lte === '') {
      delete(query.answer_set__user__talk_posts__lte);
    }
    return query;
  }

  handleFilterChange(e) {
    if (e.target.type === 'checkbox') {
      const name = e.target.name.split('.');
      this.setState({
        userFilter: {
          ...this.state.userFilter,
          [name[0]]: {
            ...this.state.userFilter[name[0]],
            [name[1]]: e.target.checked,
          },
        },
      });
    } else {
      this.setState({
        userFilter: {
          ...this.state.userFilter,
          [e.target.name]: e.target.value,
        },
      });
    }
  }

  handleSubmit() {
    const query = this.getQuery();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    this.setState({ scrollX, scrollY }, () => {
      getStats(query, '1/')
        .then((data) => (
          this.setState({
            count: data.count,
            query,
          })
        )
      );
    });
  }

  scrollPage() {
    window.scrollBy(this.state.scrollX, this.state.scrollY);
  }

  toggleBusy(callback = this.scrollPage) {
    this.setState({ busy: !this.state.busy }, callback);
  }

  toggleOpen() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const filterProps = {
      open: this.state.open,
      toggleOpen: this.toggleOpen,
      handleChange: this.handleFilterChange,
      filterState: this.state.userFilter,
      onSubmit: this.handleSubmit,
      count: this.state.count,
      busy: this.state.busy,
      csv: true,
    };
    return (
      <Grid>
        <Row>
          <Col xs={3} md={2}>
            <div className="sidebar">
              <Tabs />
            </div>
          </Col>
          <Col xs={7} md={10} id="content">
            {React.cloneElement(this.props.children, { query: this.state.query, filterProps, toggleBusy: this.toggleBusy })}
          </Col>
        </Row>
      </Grid>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};
