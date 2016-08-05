import React from 'react';
import getStats from './stats-api';
import Plotly from 'react-plotlyjs';

export default class PlotSet extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.getPlot = this.getPlot.bind(this);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const paramSet = {
      ...this.props.params,
      category: this.props.category,
    };
    getStats(paramSet)
      .then((data) => (
        this.setState({ data })
      ));
  }

  getPlot() {
    if (this.state.data !== null) {
      const data = [];
      for (const result of this.state.data.results) {
        const datum = {};
        switch (result.plot_type) {
          case 'P':
            datum.type = 'pie';
            datum.values = [];
            datum.labels = [];
            for (const key in result.results) {
              datum.labels.push(key);
              datum.values.push(result.results[key]);
            }
            break;
          default:
            break;
        }
        data.push(datum);
      }
      return <Plotly data={data} />;
    }
    return <div />;
  }

  render() {
    const inside = this.getPlot();
    return (
      <div>
        {inside}
      </div>
    );
  }
}

PlotSet.propTypes = {
  params: React.PropTypes.object,
  category: React.PropTypes.string,
};

PlotSet.defaultProps = {
  params: {},
  category: '',
};
