import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../../layout';
import Seo from '../../components/seo';
import ArticleNavigator from '../../components/post-navigator';
import Post from '../../models/post';
import Utterances from '../../components/utterances';
import './style.scss';
import Profile from '../../components/profile';
import BuyMeACoffeeWrapper from '../../components/buy-me-a-coffe-wrapper';
import ArticleHeader from '../../components/post-header';
import ArticleContent from '../../components/post-content';

function Index({ data }) {
  const curPost = new Post(data.cur);
  const prevPost = data.prev && new Post(data.prev);
  const nextPost = data.next && new Post(data.next);
  const { comments } = data.site?.siteMetadata;
  const utterancesRepo = comments?.utterances?.repo;

  return (
    <Layout>
      <Seo title={curPost?.title + ' | 개발자 윈터'} description={curPost?.excerpt} />
      <ArticleHeader post={curPost} />
      <ArticleContent html={curPost.html} />
      <BuyMeACoffeeWrapper />
      <hr className="divider" />
      <Profile />
      <hr className="divider" />
      <ArticleNavigator prevPost={prevPost} nextPost={nextPost} />
      {utterancesRepo && <Utterances repo={utterancesRepo} path={curPost.slug} />}
    </Layout>
  );
}

export default Index;

export const pageQuery = graphql`
  query ($slug: String, $nextSlug: String, $prevSlug: String) {
    cur: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt(pruneLength: 500, truncate: true)
      frontmatter {
        date(formatString: "YYYY. MM. DD")
        title
        categories
        author
        emoji
      }
      fields {
        slug
      }
    }

    next: markdownRemark(fields: { slug: { eq: $nextSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY. MM. DD")
        title
        categories
        author
        emoji
      }
      fields {
        slug
      }
    }

    prev: markdownRemark(fields: { slug: { eq: $prevSlug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY. MM. DD")
        title
        categories
        author
        emoji
      }
      fields {
        slug
      }
    }

    site {
      siteMetadata {
        siteUrl
        comments {
          utterances {
            repo
          }
        }
      }
    }
  }
`;
