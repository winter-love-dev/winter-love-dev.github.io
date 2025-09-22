import { Link, StaticQuery, graphql } from 'gatsby';
import React, { useState, useEffect } from 'react';
import Post from '../../models/post';
import PostSearch from '../post-search';
import ThemeSwitch from '../theme-switch';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import './style.scss';

function PageHeader({ siteTitle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    let ticking = false;
    let lastScrollYRef = lastScrollY;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (Math.abs(currentScrollY - lastScrollYRef) > 10) {
            if (currentScrollY > lastScrollYRef && currentScrollY > 100) {
              setIsHeaderVisible(prev => {
                if (prev) {
                  setIsMenuOpen(false);
                  return false;
                }
                return prev;
              });
            } else if (currentScrollY < lastScrollYRef) {
              setIsHeaderVisible(prev => prev ? prev : true);
            }

            lastScrollYRef = currentScrollY;
            setLastScrollY(currentScrollY);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        <>
          <header className={`page-header-wrapper ${isHeaderVisible ? 'visible' : 'hidden'}`}>
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
                <Link className="link" to="/insights">
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
                  isHeaderVisible={isHeaderVisible}
                />
              </div>
              <div className="mobile-navigation">
                <IconButton className="hamburger-button" onClick={toggleMenu}>
                  {isMenuOpen ? (
                    <CloseIcon className="hamburger-icon" />
                  ) : (
                    <MenuIcon className="hamburger-icon" />
                  )}
                </IconButton>
                {isMenuOpen && (
                  <div className="mobile-menu-dropdown">
                    <Link className="mobile-link" to="/about" onClick={() => setIsMenuOpen(false)}>
                      about
                    </Link>
                    <Link className="mobile-link" to="/articles" onClick={() => setIsMenuOpen(false)}>
                      articles
                    </Link>
                    <Link className="mobile-link" to="/insights" onClick={() => setIsMenuOpen(false)}>
                      insights
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 헤더가 숨겨졌을 때 표시되는 로고 */}
        <div className={`floating-logo ${!isHeaderVisible ? 'visible' : 'hidden'}`}>
          <Link className="logo-link" to="/">
            {siteTitle}
          </Link>
        </div>
        </>
      )}
    />
  );
}

export default PageHeader;
