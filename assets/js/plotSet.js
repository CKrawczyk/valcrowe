import React from 'react';
import { Row, Col } from 'react-bootstrap';
import getStats from './stats-api';
import Plot from './plot';
import Legend from './legend';
import plotOrder from './plot_order';

export default class PlotSet extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.getPlots = this.getPlots.bind(this);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.categoryID !== nextProps.params.categoryID) {
      this.setState({ data: null }, this.getData);
    }
  }

  getData() {
    const paramSet = {
      ...this.props.queryFilter,
      category: this.props.params.categoryID,
    };
    getStats(paramSet)
      .then((data) => (
        this.setState({ data })
      ));
  }

  getPlots() {
    /* eslint no-case-declarations: 0 */
    const plots = [];
    let idx = 0;
    let ldx = 0;
    if (this.state.data !== null) {
      for (const info of plotOrder[this.props.params.categoryID]) {
        const result = this.state.data.results[info.index];
        switch (info.type) {
          case 'plot':
            plots.push(<Plot input={result} key={result.number} info={info} />);
            break;
          case 'Legend':
            plots.push(<Legend key={`Legend:${ldx}`} xs={info.xs} type={info.legendType} />);
            ldx += 1;
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
              <Col xs={info.xs} key={`Context:${result.number}`}>
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
    }
    return plots;
  }

  render() {
    const inside = this.getPlots();
    return (
      <div>
        <Row>
          {inside}
        </Row>
      </div>
    );
  }
}

PlotSet.propTypes = {
  params: React.PropTypes.object,
  queryFilter: React.PropTypes.object,
};

PlotSet.defaultProps = {
  queryFilter: {},
};
