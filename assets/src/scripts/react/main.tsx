/**
 * @fileoverview react/main.tsx
 *
 * @version  1.1.7
 * @update   2016/09/04
 */

/// <reference path="../../../typings/index.d.ts" />

'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
 
interface CommentBoxProps extends React.Props<any> {
  link: string;
}
 
class CommentBox extends React.Component<any, any> {
  render() {
    return <div className="commentBox">
              React Sample <a href={this.props.link}>A JAVASCRIPT LIBRARY FOR BUILDING USER INTERFACES</a>
            </div>;
  }
}
 
ReactDOM.render(
    <CommentBox link="https://facebook.github.io/react/" />,
    document.getElementById('content')
);
