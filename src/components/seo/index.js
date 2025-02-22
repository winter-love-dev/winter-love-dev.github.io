import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import favicon from '@/static/favicon.png';

  function Seo({ description, title, thumbnail, slug, tags }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author {
              name
            }
            ogImage
            siteUrl
          }
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;
  const metaImage = thumbnail
    ? `${site.siteMetadata.siteUrl}/${thumbnail}` // 개별 썸네일 사용
    : `${site.siteMetadata.siteUrl}${site.siteMetadata.ogImage}`; // 기본 OG 이미지
  const metaUrl = slug ? `${site.siteMetadata.siteUrl}${slug}` : site.siteMetadata.siteUrl;

  return (
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={title}
      defaultTitle={site.siteMetadata.title}
      meta={[
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:site_title`,
          content: title,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: 'og:author',
          content: site.siteMetadata.author.name,
        },
        {
          property: 'og:images',
          content: metaImage,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: "og:url",
          content: metaUrl,
        },
        {
          property: `og:type`,
          content: `article`,
        },
        {
          name: "keywords",
          content: tags ? tags.join(", ") : "",
        },
      ]}
      link={[
        { rel: 'shortcut icon', type: 'images/png', href: `${favicon}` }
      ]}
    />
  );
}

export default Seo;
