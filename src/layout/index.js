import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';
import ThemeSwitch from '../components/theme-switch';
import './style.scss';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          author {
            name
            social {
              github
            }
          }
        }
      }
    }
  `);
  const { title, author } = data.site.siteMetadata;

  return (
    <div>
      <div className="page-wrapper">
        <PageHeader siteTitle={title || `Title`} />
        <main className="page-content">{children}</main>
        <ThemeSwitch />
      </div>
      <PageFooter
        className="page-footer-wrapper"
        author={author.name || `Author`}
        githubUrl={author.social?.github || `https://www.github.com`}
      />
    </div>
  );
};

export default Layout;
