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
    this.getCsv = this.getCsv.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      busyQuestions: false,
      busyUsers: false,
      page: 1,
      results: [],
      csv: null,
      questions: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.categoryID !== nextProps.categoryID || this.props.query !== nextProps.query) {
      this.setState({ csv: null, questions: null, page: 1, results: [] });
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

  getCsv() {
    const flatData = this.state.results.map((datum) => (
      flatten(datum, { safe: true })
    ));
    const csv = json2csv({ data: flatData });
    this.setState({ csv, busyUsers: false }, () => { if (this.state.questions) { this.onSave(); } });
  }

  getData() {
    const paramSet = {
      page_size: 100,
      page: this.state.page,
      answer_list__question__category__category: this.props.categoryID,
    };
    /* eslint guard-for-in: 0 */
    /* eslint no-restricted-syntax: 0 */
    for (const key in this.props.query) {
      const newKey = key.replace('answer_set__user__', '');
      paramSet[newKey] = this.props.query[key];
    }
    if (!this.state.questions) {
      this.setState({ busyQuestions: true }, () => {
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
    }
    this.setState({ busyUsers: true }, () => {
      getUsers(paramSet)
        .then((data) => {
          const results = [...this.state.results, ...data.results];
          let callback;
          if (data.next) {
            callback = this.getData;
          } else {
            callback = this.getCsv;
          }
          this.setState({ results, page: this.state.page + 1 }, callback);
        });
    });
  }

  render() {
    let inner;
    if (this.state.busyUsers || this.state.busyQuestions) {
      inner = (
        <span>
          {`${100 * (this.state.page - 1) / 20}% `}
          <Spinner noFadeIn />
        </span>
      );
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
