import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import ArticleNavigator from '../components/post-navigator';
import Post from '../models/post';
import Utterances from '../components/utterances';
import Profile from '../components/profile';
import BuyMeACoffeeWrapper from '../components/buy-me-a-coffe-wrapper';
import ArticleHeader from '../components/post-header';
import ArticleContent from '../components/post-content';
import Divider from '../components/divider-horizon';

function Index({ data }) {
  const curPost = new Post(data.cur);
  const prevPost = data.prev && new Post(data.prev);
  const nextPost = data.next && new Post(data.next);
  const { comments } = data.site?.siteMetadata;
  const utterancesRepo = comments?.utterances?.repo;

  const thumbnailUrl = curPost.thumbnail?.publicURL || null;

  return (
    <Layout>
      <Seo
        title={curPost?.title + ' | 개발자 윈터'}
        description={curPost?.excerpt}
        thumbnail={thumbnailUrl}
        slug={curPost.slug}
        tags={curPost.tags}
      />
      <ArticleHeader post={curPost} />
      <ArticleContent html={curPost.html} />
      <BuyMeACoffeeWrapper />
      <Divider />
      <Profile />
      <Divider />
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
        thumbnail { # File 타입으로 직접 접근
          publicURL # File 노드에서 제공
        }
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
