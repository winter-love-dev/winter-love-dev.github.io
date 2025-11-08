import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';
import ThemeSwitch from '../components/theme-switch';
import './style.scss';

const Layout = ({ children, pageType }) => {
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

  // Insight 페이지 여부에 따라 클래스 추가
  const isInsightPage = pageType === 'insight';
  const wrapperClass = isInsightPage ? 'page-wrapper page-wrapper--insight' : 'page-wrapper';

  return (
    <div>
      <div className={wrapperClass}>
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
