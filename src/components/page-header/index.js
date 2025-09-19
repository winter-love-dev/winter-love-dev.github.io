import { Link, StaticQuery, graphql } from 'gatsby';
import React, { useState } from 'react';
import Post from '../../models/post';
import PostSearch from '../post-search';
import ThemeSwitch from '../theme-switch';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './style.scss';

function PageHeader({ siteTitle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <StaticQuery
      query={graphql`
        query SearchIndexQuery {
          allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
            edges {
              node {
                frontmatter {
                  title
                  categories
                }
                fields {
                  slug
                }
              }
            }
          }
        }
      `}
      render={(data) => (
        <header className="page-header-wrapper">
          <div className="page-header">
            <div className="front-section">
              <Link className="link" to="/">
                {siteTitle}
              </Link>
            </div>
            <div className="trailing-section">
              <div className="navigation-links">
                <Link className="link" to="/about">
                  about
                </Link>
                <Link className="link" to="/articles">
                  articles
                </Link>
                <Link className="link" to="/thoughts">
                  insights
                </Link>
{/*                <Link className="link" to="/projects">
                  Projects
                </Link>*/}
              </div>

              <div className="theme-switch-section">
                <ThemeSwitch />
              </div>
              <div className="search-section">
                <PostSearch
                  posts={data.allMarkdownRemark.edges.map(({ node }) => new Post(node, true))}
                />
              </div>
              <div className="mobile-navigation">
                <button className="hamburger-button" onClick={toggleMenu}>
                  {isMenuOpen ? (
                    <CloseIcon className="hamburger-icon" />
                  ) : (
                    <MenuIcon className="hamburger-icon" />
                  )}
                </button>
                {isMenuOpen && (
                  <div className="mobile-menu-dropdown">
                    <Link className="mobile-link" to="/about" onClick={() => setIsMenuOpen(false)}>
                      about
                    </Link>
                    <Link className="mobile-link" to="/articles" onClick={() => setIsMenuOpen(false)}>
                      articles
                    </Link>
                    <Link className="mobile-link" to="/thoughts" onClick={() => setIsMenuOpen(false)}>
                      insights
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}
    />
  );
}

export default PageHeader;
