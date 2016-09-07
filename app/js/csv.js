import React from 'react';
import { Col, Button } from 'react-bootstrap';
import { getUsers, getQuestions } from './stats-api';
import json2csv from 'json2csv';
import Spinner from 'react-spinkit';
import flatten from 'flat';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default class Csv extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.toggleBusy = this.toggleBusy.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      busyQuestions: false,
      busyUsers: false,
      csv: null,
      questions: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.categoryID !== nextProps.categoryID || this.props.query !== nextProps.query) {
      this.setState({ csv: null, questions: null });
    }
  }

  onSave() {
    const zip = new JSZip();
    zip.file(`VOLCROWE_data_${this.props.categoryID}/VOLCROWE_data.csv`, this.state.csv);
    zip.file(`VOLCROWE_data_${this.props.categoryID}/VOLCROWE_questions.csv`, this.state.questions);
    zip.generateAsync({ type: 'blob' })
      .then((blob) => {
        FileSaver.saveAs(blob, `VOLCROWE_export_${this.props.categoryID}.zip`);
      });
  }

  onClick() {
    if (this.state.csv && this.state.questions) {
      this.onSave();
    } else {
      this.getData();
    }
  }

  getData() {
    const paramSet = {
      page_size: 2000,
      answer_list__question__category__category: this.props.categoryID,
    };
    /* eslint guard-for-in: 0 */
    /* eslint no-restricted-syntax: 0 */
    for (const key in this.props.query) {
      const newKey = key.replace('answer_set__user__', '');
      paramSet[newKey] = this.props.query[key];
    }
    this.toggleBusy('busyQuestions', () => {
      getQuestions({ category: this.props.categoryID })
        .then((data) => {
          const questions = json2csv({ data: data.results });
          this.setState({ questions, busyQuestions: false });
        })
        .then(() => {
          if (this.state.csv && this.state.questions) {
            this.onSave();
          }
        });
    });
    this.toggleBusy('busyUsers', () => {
      getUsers(paramSet)
        .then((data) => {
          const flatData = data.results.map((datum) => (
            flatten(datum, { safe: true })
          ));
          const csv = json2csv({ data: flatData });
          this.setState({ csv, busyUsers: false });
        })
        .then(() => {
          if (this.state.csv && this.state.questions) {
            this.onSave();
          }
        });
    });
  }

  toggleBusy(key, callback) {
    this.setState({ [key]: !this.state[key] }, callback);
  }

  render() {
    let inner;
    if (this.state.busyUsers || this.state.busyQuestions) {
      inner = <Spinner noFadeIn />;
    } else {
      inner = 'Download visible data';
    }
    return (
      <Col {...this.props.bs}>
        <Button
          block
          bsSize="xsmall"
          disabled={this.state.busyUsers || this.state.busyQuestions}
          onClick={this.onClick}
        >
          {inner}
        </Button>
      </Col>
    );
  }
}

Csv.propTypes = {
  categoryID: React.PropTypes.string,
  query: React.PropTypes.object,
  bs: React.PropTypes.object,
};

Csv.defaultProps = {
  categoryID: 'Lo',
  query: {},
  bs: {
    xs: 12,
  },
};
