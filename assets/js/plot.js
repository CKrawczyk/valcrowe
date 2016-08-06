import React from 'react';
import Plotly from 'react-plotlyjs';

export default class Plot extends React.Component {
  constructor(props) {
    super(props);
    this.getPlot = this.getPlot.bind(this);
    this.state = {
      data: null,
      layout: null,
    };
  }

  componentDidMount() {
    this.getPlot();
  }

  getPlot() {
    const data = [];
    const layout = {};
    switch (this.props.input.plot_type) {
      case 'P':
        data.push({});
        data[0].type = 'pie';
        data[0].values = [];
        data[0].labels = [];
        for (const key in this.props.input.results) {
          data[0].labels.push(key);
          data[0].values.push(this.props.input.results[key]);
        }
        break;
      case 'M':
        data.push({});
        data[0].type = 'scattergeo';
        data[0].lat = this.props.input.results.lat;
        data[0].lon = this.props.input.results.lon;
        data[0].marker = {
          size: this.props.input.results.count,
        };
        break;
      case 'H':
        data.push({});
        data[0].type = 'histogram';
        data[0].x = this.props.input.results;
        break;
      case 'Q':
        data.push({});
        data[0].type = 'scatter';
        data[0].mode = 'markers';
        data[0].x = this.props.input.results.scores;
        data[0].y = this.props.input.results.confidence;
        data[0].marker = {
          opacity: 0.01,
        };
        data.push({});
        data[1].type = 'histogram';
        data[1].x = this.props.input.results.scores;
        data[1].yaxis = 'y2';
        data.push({});
        data[2].type = 'histogram';
        data[2].y = this.props.input.results.confidence;
        data[2].xaxis = 'x2';
        layout.showlegend = false;
        layout.autosize = false;
        layout.bargap = 0;
        layout.xaxis = {
          domain: [0, 0.65],
          showgrid: false,
          zeroline: false,
        };
        layout.yaxis = {
          domain: [0, 0.65],
          showgrid: false,
          zeroline: false,
        };
        layout.xaxis2 = {
          domain: [0.65, 1],
          showgrid: false,
          zeroline: false,
        };
        layout.yaxis2 = {
          domain: [0.65, 1],
          showgrid: false,
          zeroline: false,
        };
        break;
      default:
        break;
    }
    this.setState({ data, layout });
  }

  render() {
    let output = <div>Loading...</div>;
    if (this.state.data !== null) {
      output = <Plotly data={this.state.data} layout={this.state.layout} />;
    }
    return output;
  }
}

Plot.propTypes = {
  input: React.PropTypes.object,
};
