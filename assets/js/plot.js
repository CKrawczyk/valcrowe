import React from 'react';
import ReactDom from 'react-dom';
import Plotly from 'react-plotlyjs';
import { Col } from 'react-bootstrap';
import Keys from './pieKeys';

export default class Plot extends React.Component {
  constructor(props) {
    super(props);
    this.getPlot = this.getPlot.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      data: null,
      layout: null,
      config: null,
      size: 0,
    };
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getPlot() {
    const data = [];
    const layout = {
      width: this.state.size,
      showlegend: false,
      hovermode: 'closest',
    };
    const config = {
      displaylogo: false,
    };
    /* eslint no-case-declarations: 0 */
    /* eslint guard-for-in: 0 */
    /* eslint no-restricted-syntax: 0 */
    switch (this.props.input.plot_type) {
      case 'P':
        const labels = [];
        const values = [];
        const colors = [];
        for (const key in this.props.input.results) {
          const KeyTable = Keys[this.props.info.pieType];
          labels.push(KeyTable[key].text);
          values.push(this.props.input.results[key]);
          colors.push(KeyTable[key].color);
        }
        data.push({
          type: 'pie',
          values,
          labels,
          textposition: 'inside',
          marker: {
            colors,
          },
        });
        layout.height = this.state.size;
        layout.margin = {
          l: 0,
          r: 0,
          b: 30,
          t: 30,
          pad: 0,
        };
        break;
      case 'M':
        const markerSize = [];
        for (const count of this.props.input.results.count) {
          markerSize.push(Math.pow(count, 0.6) + 5);
        }
        data.push({
          type: 'scattergeo',
          lat: this.props.input.results.lat,
          lon: this.props.input.results.lon,
          hoverinfo: 'text',
          text: this.props.input.results.count,
          marker: {
            size: markerSize,
          },
        });
        layout.margin = {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
          pad: 0,
        };
        layout.geo = {
          resolution: 30,
          projection: {
            type: 'robinson',
          },
        };
        break;
      case 'H':
        const histOptions = this.props.info.options || {};
        data.push({
          type: 'histogram',
          x: this.props.input.results,
          ...histOptions,
        });
        layout.margin = {
          r: 0,
          t: 20,
          pad: 0,
        };
        layout.yaxis = {
          title: 'Number',
        };
        layout.xaxis = this.props.info.xaxis || {};
        break;
      case 'Q':
        data.push({
          type: 'scatter',
          mode: 'markers',
          x: this.props.input.results.scores,
          y: this.props.input.results.confidence,
          marker: {
            opacity: 0.01,
          },
        });
        data.push({
          type: 'histogram',
          x: this.props.input.results.scores,
          yaxis: 'y2',
        });
        data.push({
          type: 'histogram',
          y: this.props.input.results.confidence,
          xaxis: 'x2',
        });
        layout.margin = {
          r: 0,
          t: 0,
          pad: 0,
        };
        layout.showlegend = false;
        layout.autosize = false;
        layout.bargap = 0;
        layout.xaxis = {
          domain: [0, 0.8],
          showgrid: false,
          zeroline: false,
          title: 'Score',
        };
        layout.yaxis = {
          domain: [0, 0.75],
          showgrid: false,
          zeroline: false,
          title: 'Confidence',
        };
        layout.xaxis2 = {
          domain: [0.8, 1],
          showgrid: false,
          zeroline: false,
          title: 'Number',
        };
        layout.yaxis2 = {
          domain: [0.75, 1],
          showgrid: false,
          zeroline: false,
          title: 'Number',
        };
        break;
      default:
        break;
    }
    this.setState({ data, layout, config });
  }

  handleResize() {
    const element = ReactDom.findDOMNode(this);
    const size = Math.floor(element.offsetWidth) - 30;
    if (this.state.size !== size) {
      this.setState({ size }, this.getPlot);
    }
  }

  render() {
    let output = (
      <Col {...this.props.info.bs} name={`result-${this.props.input.number}`}>
        <div>Loading...</div>
      </Col>
    );
    if (this.state.data !== null) {
      output = (
        <Col {...this.props.info.bs} name={`result-${this.props.input.number}`}>
          <div className="title">{this.props.input.question_text}</div>
          <Plotly data={this.state.data} layout={this.state.layout} config={this.state.config} />
        </Col>
      );
    }
    return output;
  }
}

Plot.propTypes = {
  info: React.PropTypes.object,
  input: React.PropTypes.object,
};
