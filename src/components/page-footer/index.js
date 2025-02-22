import React from 'react';
import './style.scss';

function PageFooter({ author, githubUrl }) {
  return (
    <footer className="page-footer-wrapper">
      <p className="page-footer">
        © 2025. Seonghun Kim all rights reserved.
      </p>
    </footer>
  );
}

export default PageFooter;
