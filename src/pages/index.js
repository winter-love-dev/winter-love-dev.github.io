import React, { useCallback, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import HomeBio from '../components/home-bio';
import Post from '../models/post';

import { getUniqueCategories } from '../utils/helpers';
import PostTabs from '../components/post-tabs';

function HomePage({ data }) {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => new Post(node));
  const { author, language } = data.site.siteMetadata;
  const categories = ['All', ...getUniqueCategories(posts)];
  const featuredTabIndex = categories.findIndex((category) => category === 'featured');
  const [tabIndex, setTabIndex] = useState(featuredTabIndex === -1 ? 0 : featuredTabIndex);
  const onTabIndexChange = useCallback((e, value) => setTabIndex(value), []);

  return (
    <Layout>
      <Seo title="Winter's archive" />
      <HomeBio author={author} language={language} />
      <PostTabs
        posts={posts}
        onChange={onTabIndexChange}
        tabs={categories}
        tabIndex={tabIndex}
        showMoreButton
      />
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
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 500, truncate: true)
          frontmatter {
            categories
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
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
