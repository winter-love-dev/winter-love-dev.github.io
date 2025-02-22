import React from 'react';
import './style.scss';

function ArticleContent({ html }) {
  return (
    <div className="post-content">
      <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
export default ArticleContent;
