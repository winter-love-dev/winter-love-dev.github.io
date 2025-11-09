import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import favicon from '@/static/favicon.png';

function Seo({
  description,
  title,
  thumbnail,
  slug,
  tags,
  // 아티클 전용 필드
  articleDescription,
  articleKeywords,
  articleAuthor,
  articleDate,
  articleModifiedDate,
  // 인사이트 전용 필드
  insightDescription,
  insightKeywords,
  insightAuthor,
  insightDate,
  insightModifiedDate,
  // 공통
  type = 'article'
}) {
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

  // 아티클 또는 인사이트에 따라 description/keywords 우선순위 결정
  const finalDescription = articleDescription || insightDescription || description || site.siteMetadata.description;
  const finalKeywords = articleKeywords || insightKeywords || (tags ? tags.join(", ") : "");
  const finalAuthor = articleAuthor || insightAuthor || site.siteMetadata.author.name;
  const finalDate = articleDate || insightDate;
  const finalModifiedDate = articleModifiedDate || insightModifiedDate || finalDate;

  const metaDescription = finalDescription;
  const metaImage = thumbnail
    ? `${site.siteMetadata.siteUrl}${thumbnail}` // 개별 썸네일 사용
    : `${site.siteMetadata.siteUrl}${site.siteMetadata.ogImage}`; // 기본 OG 이미지
  const metaUrl = slug ? `${site.siteMetadata.siteUrl}${slug}` : site.siteMetadata.siteUrl;

  // JSON-LD - Article Schema
  const structuredData = type === 'article' && finalDate ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": metaDescription,
    "image": metaImage,
    "author": {
      "@type": "Person",
      "name": finalAuthor
    },
    "publisher": {
      "@type": "Organization",
      "name": site.siteMetadata.title,
      "logo": {
        "@type": "ImageObject",
        "url": `${site.siteMetadata.siteUrl}${site.siteMetadata.ogImage}`
      }
    },
    "datePublished": finalDate,
    "dateModified": finalModifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": metaUrl
    },
    "keywords": finalKeywords
  } : null;

  return (
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={title}
      defaultTitle={site.siteMetadata.title}
      meta={[
        // 기본 메타 태그
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: "keywords",
          content: finalKeywords,
        },
        {
          name: "author",
          content: finalAuthor,
        },
        // Open Graph 메타 태그
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: 'og:image',
          content: metaImage,
        },
        {
          property: 'og:image:width',
          content: '1200',
        },
        {
          property: 'og:image:height',
          content: '630',
        },
        {
          property: "og:url",
          content: metaUrl,
        },
        {
          property: `og:type`,
          content: type,
        },
        {
          property: 'og:site_name',
          content: site.siteMetadata.title,
        },
        {
          property: 'og:locale',
          content: 'ko_KR',
        },
        // 아티클 전용 Open Graph 메타 태그
        ...(finalDate ? [
          {
            property: 'article:published_time',
            content: finalDate,
          },
          {
            property: 'article:modified_time',
            content: finalModifiedDate,
          },
          {
            property: 'article:author',
            content: finalAuthor,
          },
        ] : []),
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
        {
          name: 'twitter:image',
          content: metaImage,
        },
        // 검색 엔진 최적화
        {
          name: 'robots',
          content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        {
          name: 'googlebot',
          content: 'index, follow',
        },
      ]}
      link={[
        { rel: 'shortcut icon', type: 'images/png', href: `${favicon}` },
        { rel: 'canonical', href: metaUrl },
      ]}
    >
      {/* JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default Seo;