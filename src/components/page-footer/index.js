import React from 'react';
import './style.scss';

function PageFooter({ author, githubUrl }) {
  return (
    <footer className="page-footer-wrapper">
      <p className="page-footer">
        © Winter archive 2026
      </p>
    </footer>
  );
}

export default PageFooter;
