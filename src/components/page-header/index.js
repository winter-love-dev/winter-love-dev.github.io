import { Link, StaticQuery, graphql } from 'gatsby';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  useEffect(() => {
    let timeoutId = null;

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;

        // Throttle: 최대 33ms(30fps)마다 실행
        if (timeoutId) return;

        timeoutId = setTimeout(() => {
          requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;

            if (Math.abs(currentScrollY - lastScrollYRef.current) > 10) {
              if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
                setIsHeaderVisible(prev => {
                  if (prev) {
                    setIsMenuOpen(false);
                    return false;
                  }
                  return prev;
                });
              } else if (currentScrollY < lastScrollYRef.current) {
                setIsHeaderVisible(prev => prev ? prev : true);
              }

              lastScrollYRef.current = currentScrollY;
            }

            tickingRef.current = false;
            timeoutId = null;
          });
        }, 33);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <StaticQuery
      query={graphql`
        query SearchIndexQuery {
          allMarkdownRemark(
            filter: { frontmatter: { private: { ne: true }, insightPrivate: { ne: true } } }
            sort: { fields: frontmatter___date, order: DESC }
          ) {
            edges {
              node {
                frontmatter {
                  title
                  categories
                  insightTitle
                  insightPostId
                }
                fields {
                  slug
                }
                fileAbsolutePath
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
