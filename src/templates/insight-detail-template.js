import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';

// 임시 Insight 상세 페이지 (Phase 4에서 정식 작성 예정)
const InsightDetailTemplate = ({ data, pageContext }) => {
  const insight = data.markdownRemark;
  const { isTruncated, truncatedContent, maxLines } = pageContext;

  return (
    <Layout pageType="insight">
      <Seo title={`${insight.frontmatter.insightTitle} | Winter's archive`} />
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Insight Detail (임시 페이지)</h1>
        <p>Phase 1 빌드 테스트용 임시 페이지입니다.</p>

        <div style={{ border: '1px solid #ccc', padding: '16px', marginTop: '24px' }}>
          <h2>{insight.frontmatter.insightTitle}</h2>
          <p>post-id: {insight.frontmatter.insightPostId}</p>
          <p>date: {insight.frontmatter.insightDate}</p>
          <p>tags: {insight.frontmatter.insightTags?.join(', ') || 'none'}</p>
          <p>isTruncated: {isTruncated ? 'Yes' : 'No'}</p>
          <p>maxLines: {maxLines}</p>

          <hr />

          <div dangerouslySetInnerHTML={{ __html: insight.html }} />
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query InsightDetailQuery($insightPostId: String!) {
    markdownRemark(
      frontmatter: { insightPostId: { eq: $insightPostId } }
      fileAbsolutePath: { regex: "/insights/" }
    ) {
      id
      html
      rawMarkdownBody
      frontmatter {
        insightPostId
        insightTitle
        insightDate
        insightTags
      }
    }
  }
`;

export default InsightDetailTemplate;
