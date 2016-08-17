import React from 'react';
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
    x: [1, 2, 1, 2, 1, 2, 1, 2],
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

const Legend = (props) => {
  const text = [];
  const color = [];
  /* eslint guard-for-in: 0 */
  /* eslint no-restricted-syntax: 0 */
  for (const key in Keys[props.info.legendType]) {
    text.push(Keys[props.info.legendType][key].text.replace(' <br>', ''));
    color.push(Keys[props.info.legendType][key].color);
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
  return (
    <Col {...props.info.bs}>
      <Plotly data={data} layout={layout} config={config} />
    </Col>
  );
};

Legend.propTypes = {
  info: React.PropTypes.object,
};

export default Legend;
