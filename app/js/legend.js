import React from 'react';
import ReactDom from 'react-dom';
import Plotly from 'react-plotlyjs';
import { Col } from 'react-bootstrap';
import Keys from './pieKeys';

const pos = {
  2: {
    x: [1.5, 2.5],
    y: [1, 1],
    yrange: [0.5, 1.5],
    height: 22,
  },
  8: {
    x: [0.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.5, 2.5],
    y: [4, 4, 3, 3, 2, 2, 1, 1],
    yrange: [0.5, 4.5],
    height: 90,
  },
  10: {
    x: [0.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.5, 2.5],
    y: [5, 5, 4, 4, 3, 3, 2, 2, 1, 1],
    yrange: [0.5, 5.5],
    height: 112,
  },
};

export default class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
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
    this.getData();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getData() {
    const text = [];
    const color = [];
    /* eslint guard-for-in: 0 */
    /* eslint no-restricted-syntax: 0 */
    for (const key in Keys[this.props.info.legendType]) {
      text.push(Keys[this.props.info.legendType][key].text.replace(' <br>', ''));
      color.push(Keys[this.props.info.legendType][key].color);
    }
    const length = text.length;
    const data = [{
      type: 'scatter',
      mode: 'markers+text',
      x: pos[length].x,
      y: pos[length].y,
      text,
      textposition: 'right',
      hoverinfo: 'none',
      marker: {
        color,
        symbol: 'square',
        size: 10,
      },
    }];
    const layout = {
      showlegend: false,
      height: pos[length].height,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0,
      },
      xaxis: {
        range: [0, 4],
        showgrid: false,
        zeroline: false,
      },
      yaxis: {
        range: pos[length].yrange,
        showgrid: false,
        zeroline: false,
      },
    };
    const config = {
      staticPlot: true,
    };
    this.setState({ data, layout, config });
  }

  handleResize() {
    const element = ReactDom.findDOMNode(this);
    const size = Math.floor(element.offsetWidth) - 30;
    if (this.state.size !== size) {
      this.setState({
        ...this.state,
        size,
        layout: {
          ...this.state.layout,
          width: size,
        },
      });
    }
  }

  render() {
    let output = (
      <Col {...this.props.info.bs}>
        <div>Loading...</div>
      </Col>
    );
    if (this.state.data !== null) {
      output = (
        <Col {...this.props.info.bs}>
          <Plotly data={this.state.data} layout={this.state.layout} config={this.state.config} />
        </Col>
      );
    }
    return output;
  }
}

Legend.propTypes = {
  info: React.PropTypes.object,
};
