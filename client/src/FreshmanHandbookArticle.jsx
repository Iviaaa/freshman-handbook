import React from 'react';
import {Spin} from 'antd';
import 'antd/lib/icon/style/css';

const $ = require('jquery');
const apiRootPath = '/api/freshman-handbook/';
// const apiRootPath = 'http://localhost:8002/api/freshman-handbook/';


export default class FreshmanHandbookArticle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: '', contentDict: {}, loading: true };
  }

  componentDidMount() {
    const title = this.props.match.params.topicId;
    $.ajax({
      method: 'GET',
      url: `${apiRootPath}get-article-content?title=${encodeURIComponent(title)}`,
    }).done((msg) => {
      const contentDict = Object.assign({}, this.state.contentDict);
      contentDict[title] = msg;
      this.setState({ contentDict, content: msg, loading: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    const title = nextProps.match.params.topicId;
    if (title in this.state.contentDict) {
      this.setState({ content: this.state.contentDict[title], loading: false });
    } else {
      this.setState({ content: '', loading: true });
      $.ajax({
        method: 'GET',
        url: `${apiRootPath}get-article-content?title=${encodeURIComponent(title)}`,
      }).done((msg) => {
        const contentDict = Object.assign({}, this.state.contentDict);
        contentDict[title] = msg;
        this.setState({ contentDict, content: msg, loading: false });
      });
    }
  }

  render() {
    return (
      <div>
        <h1>
          {this.props.match.params.topicId}
          <Spin spinning={this.state.loading} style={{ marginLeft: 20 }} />
        </h1>
        <p>{this.state.content}</p>
      </div>
    );
  }
}