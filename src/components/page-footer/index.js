import React from 'react';
import './style.scss';

function PageFooter({ author, githubUrl }) {
  return (
    <footer className="page-footer-wrapper">
      <p className="page-footer">
        © powered by
        <a href="https://github.com/winter-love-dev/winter-love-dev.github.io">
          &nbsp;winter-love-dev
        </a>
      </p>
    </footer>
  );
}

export default PageFooter;
