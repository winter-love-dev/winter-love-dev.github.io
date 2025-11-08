import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import HomeBio from '../components/home-bio';
import HomeArticleCard from '../components/home-article-card';
import HomeInsightCard from '../components/home-insight-card';
import MenuBookIcon from '@mui/icons-material/MenuBook';

function HomePage({ data }) {
  const articles = data.allMarkdownRemark.edges;
  const insights = data.allInsights.edges.map(({ node }) => node);
  const { author, language } = data.site.siteMetadata;

  // 최신 Articles 5개만 표시
  const recentArticles = articles.slice(0, 5);
  // 최신 Insights 5개만 표시
  const recentInsights = insights.slice(0, 5);

  return (
    <Layout>
      <Seo title="Winter's archive" />
      <HomeBio author={author} language={language} />

      {/* Recent Articles 섹션 */}
      {recentArticles.length > 0 && (
        <div style={{ marginTop: '40px', width: '100%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            maxWidth: '720px',
            margin: '0 auto 20px auto',
            padding: '0 15px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--primary-text-color)'
            }}>
              Recent Articles
            </h2>
            <Link
              to="/articles"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--about-link-icon-color)',
                textDecoration: 'none'
              }}
              title="View all articles"
            >
              <MenuBookIcon style={{ fontSize: '20px' }} />
            </Link>
          </div>
          <div>
            {recentArticles.map(({ node }) => (
              <HomeArticleCard key={node.id} post={node} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Insights 섹션 */}
      {recentInsights.length > 0 && (
        <div style={{ marginTop: '60px', width: '100%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            maxWidth: '720px',
            margin: '0 auto 20px auto',
            padding: '0 15px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--primary-text-color)'
            }}>
              Recent Insights
            </h2>
            <Link
              to="/insights"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--about-link-icon-color)',
                textDecoration: 'none'
              }}
              title="View all insights"
            >
              <MenuBookIcon style={{ fontSize: '20px' }} />
            </Link>
          </div>
          <div>
            {recentInsights.map((insight) => (
              <HomeInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default HomePage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      filter: {
        frontmatter: { private: { ne: true } }
        fileAbsolutePath: { regex: "/content/" }
      }
      sort: { fields: frontmatter___date, order: DESC }
      limit: 5
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 200, truncate: true)
          frontmatter {
            categories
            title
            date(formatString: "YYYY.MM.DD")
          }
          fields {
            slug
          }
        }
      }
    }

    allInsights: allMarkdownRemark(
      filter: {
        frontmatter: { insightPrivate: { ne: true } }
        fileAbsolutePath: { regex: "/insights/" }
      }
      sort: { order: DESC, fields: [frontmatter___insightDate] }
      limit: 5
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 200, truncate: true)
          frontmatter {
            insightPostId
            insightTitle
            insightDate
            insightTags
          }
        }
      }
    }

    site {
      siteMetadata {
        author {
          name
          nickname
          bio {
            role
            description
            thumbnail
          }
          social {
            github
            linkedIn
            email
          }
        }
      }
    }
  }
`;
