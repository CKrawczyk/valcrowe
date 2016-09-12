import React from 'react';
import { Row, Col, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { getStats, getQuestions } from './stats-api';
import Plot from './plot';
import Legend from './legend';
import { numberOrder } from './plot_order';
import Spinner from 'react-spinkit';
import Filters from './filters';

class QuestionPlot extends React.Component {
  constructor(props) {
    super(props);
    this.getQuery = this.getQuery.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleBusy = this.toggleBusy.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.state = {
      query: {},
      data: {},
      count: 1913,
      busy: true,
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

  componentDidMount() {
    this.handleSubmit();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.questionNumber !== nextProps.questionNumber) {
      this.setState(
        {
          open: false,
          query: {},
          data: {},
          count: 1913,
          busy: true,
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
        },
        this.handleSubmit.bind(this, nextProps.questionNumber)
      );
    }
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

  handleSubmit(questionNumber = this.props.questionNumber) {
    const query = this.getQuery();
    this.setState({ busy: true }, () => {
      getStats(query, `${questionNumber}/`)
        .then((data) => {
          this.setState({
            count: data.count,
            query,
            data,
            busy: false,
          });
        }
      );
    });
  }

  toggleBusy(callback = this.scrollPage) {
    this.setState({ busy: !this.state.busy }, callback);
  }

  toggleOpen() {
    this.setState({ open: !this.state.open });
  }

  render() {
    let inner;
    if (this.state.busy) {
      inner = (
        <Col {...this.props.layout.bs}>
          <Spinner noFadeIn />
        </Col>
      );
    } else {
      const filterProps = {
        open: true,
        handleChange: this.handleFilterChange,
        filterState: this.state.userFilter,
        onSubmit: this.handleSubmit.bind(this, this.props.questionNumber),
        count: this.state.count,
        busy: this.state.busy,
        csv: false,
      };
      const popover = (
        <Popover title="Filters" id="popover-filters">
          <Row>
            <Filters {...filterProps} query={this.state.query} className="--popover" />
          </Row>
        </Popover>
      );
      let remove = <Button disabled block bsSize="small">Remove</Button>;
      if (this.props.remove) {
        remove = <Button block bsSize="small" onClick={this.props.remove}>Remove</Button>;
      }
      inner = (
        <Plot input={this.state.data} info={this.props.layout}>
          <Row>
            <Col xs={8}>
              <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popover}>
                <Button block bsSize="small">{`Filters (${this.state.count} of 1913)`}</Button>
              </OverlayTrigger>
            </Col>
            <Col xs={4}>
              {remove}
            </Col>
          </Row>
        </Plot>
      );
    }
    return inner;
  }
}

QuestionPlot.propTypes = {
  questionNumber: React.PropTypes.string,
  setQuestion: React.PropTypes.func,
  layout: React.PropTypes.object,
  remove: React.PropTypes.func,
};

export default class QuestionView extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.addFilterSet = this.addFilterSet.bind(this);
    this.removeFilterSet = this.removeFilterSet.bind(this);
    this.state = {
      question: null,
      filterSet: [],
      qdx: 1,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.questionNumber !== nextProps.params.questionNumber) {
      this.setState({ question: null, filterSet: [], qdx: 0 }, this.getData);
    }
  }

  getData() {
    getQuestions({}, `${this.props.params.questionNumber}/`)
      .then((question) => {
        this.setState({ question });
      });
  }

  addFilterSet() {
    const { layout } = numberOrder[this.props.params.questionNumber];
    /* eslint react/jsx-no-bind: 0 */
    const newFilter = (
      <QuestionPlot
        key={`FilterSet:${this.state.qdx}`}
        questionNumber={this.props.params.questionNumber}
        layout={layout}
        remove={this.removeFilterSet.bind(this, `FilterSet:${this.state.qdx}`)}
      />
    );
    this.setState({ filterSet: [...this.state.filterSet, newFilter], qdx: this.state.qdx + 1 });
  }

  removeFilterSet(key) {
    let idx = 0;
    for (const filter of this.state.filterSet) {
      if (filter.key === key) {
        break;
      }
      idx += 1;
    }
    const filterSet = [...this.state.filterSet];
    filterSet.splice(idx, 1);
    this.setState({ filterSet });
  }

  render() {
    let questionHeader;
    if (this.state.question) {
      let context;
      let br;
      if (this.state.question.context) {
        context = `${this.state.question.context} `;
        br = <br />;
      }
      questionHeader = <div className="context">{context}{br}{br}<span>{this.state.question.question_text}</span></div>;
    }
    const { layout, legend } = numberOrder[this.props.params.questionNumber];
    let legendView;
    let hr;
    if (legend) {
      legendView = <Legend key={legend.legendType} info={legend} />;
      hr = <Col xs={12}><hr /></Col>;
    }
    return (
      <Row>
        <Col xs={12}>
          <h1 className="home__center">Compare question {this.props.params.questionNumber} in different filters</h1>
        </Col>
        <Col xs={12}>
          <hr />
        </Col>
        <Col xs={12}>
          {questionHeader}
        </Col>
        <Col xs={12}>
          <hr />
        </Col>
        {legendView}
        {hr}
        <QuestionPlot questionNumber={this.props.params.questionNumber} layout={layout} />
        {this.state.filterSet}
        <Col xs={4}>
          <Button block onClick={this.addFilterSet}>Add new filter set</Button>
        </Col>
      </Row>
    );
  }
}

QuestionView.propTypes = {
  params: React.PropTypes.object,
};
