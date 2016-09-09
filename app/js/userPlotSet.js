import PlotSet from './plotSet';
import { getUserCounts } from './stats-api';

export default class UserPlotSet extends PlotSet {
  componentDidMount() {
    this.props.params.categoryID = 'Users';
    this.getData();
  }

  getData() {
    const paramSet = {};
    /* eslint guard-for-in: 0 */
    /* eslint no-restricted-syntax: 0 */
    for (const key in this.props.query) {
      const newKey = key.replace('answer_set__user__', '');
      paramSet[newKey] = this.props.query[key];
    }
    this.props.toggleBusy(() => {
      getUserCounts(paramSet)
        .then((data) => (
          this.setState({ data }, this.getPlots.bind(this, false))
        ));
    });
  }
}
