import React from 'react';
import { Row, Col, Clearfix } from 'react-bootstrap';
import { getStats } from './stats-api';
import Plot from './plot';
import Legend from './legend';
import { plotOrder } from './plot_order';
import Filters from './filters';
import { Link } from 'react-router';

export default class PlotSet extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.getPlots = this.getPlots.bind(this);
    this.state = {
      data: null,
      plots: null,
      kdx: 0,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.categoryID !== nextProps.params.categoryID || this.props.query !== nextProps.query) {
      this.setState({ data: null }, this.getData);
    }
  }

  getData() {
    const paramSet = {
      ...this.props.query,
      category: this.props.params.categoryID,
    };
    this.props.toggleBusy(() => {
      getStats(paramSet)
        .then((data) => (
          this.setState({ data }, this.getPlots)
        ));
    });
  }

  getPlots(title = true) {
    /* eslint no-case-declarations: 0 */
    const plots = [];
    let idx = 0;
    let ldx = 0;
    let bdx = 0;
    for (const info of plotOrder[this.props.params.categoryID]) {
      const result = this.state.data.results[info.index];
      switch (info.type) {
        case 'plot':
          let titleDiv;
          if (title) {
            titleDiv = (
              <div className="title">
                <Link to={`question/${result.number}`}>{`${result.number}: ${result.question_text}`}</Link>
              </div>
            );
          }
          plots.push(
            <Plot input={result} key={`${this.state.kdx}:${result.number}`} info={info}>
              {titleDiv}
            </Plot>
          );
          break;
        case 'legend':
          plots.push(<Legend key={`${this.state.kdx}:Legend:${ldx}`} info={info} />);
          ldx += 1;
          break;
        case 'blank':
          plots.push(<Col key={`${this.state.kdx}:Blank:${bdx}`} {...info.bs} />);
          plots.push(<Clearfix key={`${this.state.kdx}:Clear:${bdx}`} />);
          bdx += 1;
          break;
        case 'context':
          let hr;
          let con;
          if (idx !== 0) {
            hr = <hr />;
          }
          if (result.context) {
            con = <div className="context">{result.context}</div>;
          }
          plots.push(
            <Col {...info.bs} key={`${this.state.kdx}:Context:${result.number}`}>
              {hr}
              {con}
            </Col>
          );
          break;
        default:
          break;
      }
      idx += 1;
    }
    this.setState({ plots, kdx: this.state.kdx + 1 }, this.props.toggleBusy);
  }

  render() {
    let className = 'plots plots__collapsing';
    if (this.props.filterProps.open) {
      className = ' plots__open plots__collapsing';
    }
    return (
      <div>
        <Row>
          <Filters {...this.props.filterProps} categoryID={this.props.params.categoryID} query={this.props.query} />
        </Row>
        <Row className={className}>
          {this.state.plots}
        </Row>
      </div>
    );
  }
}

PlotSet.propTypes = {
  params: React.PropTypes.object,
  query: React.PropTypes.object,
  filterProps: React.PropTypes.object,
  toggleBusy: React.PropTypes.func,
};
