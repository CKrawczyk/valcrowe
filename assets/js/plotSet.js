import React from 'react';
import getStats from './stats-api';
import Plot from './plot';

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

  getPlots() {
    const plots = [];
    if (this.state.data !== null) {
      for (const result of this.state.data.results) {
        plots.push(<Plot input={result} key={result.number} />);
      }
    }
    return plots;
  }

  render() {
    const inside = this.getPlots();
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
