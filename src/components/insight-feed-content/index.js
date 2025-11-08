import React from 'react';
import './style.scss';

function InsightFeedContent({ html }) {
  return (
    <div className="post-content">
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
export default InsightFeedContent;
