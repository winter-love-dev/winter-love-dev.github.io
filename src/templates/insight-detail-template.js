import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import InsightFeedCard from '../components/insight-feed-card';
import ProfileWithDividers from '../components/profile-with-dividers';
import Utterances from '../components/utterances';
import { getImage } from 'gatsby-plugin-image';
import './insight-detail-template.scss';

const InsightDetailTemplate = ({ data }) => {
  const insight = data.markdownRemark;
  const { comments } = data.site?.siteMetadata;
  const utterancesRepo = comments?.utterances?.repo;

  // Author 데이터
  const profileImage = getImage(data.profileImage);
  const { nickname, bio } = data.site.siteMetadata.author;
  const authorData = { profileImage, nickname, role: bio.role };

  // Thumbnail 이미지
  const thumbnailUrl = insight.frontmatter.insightThumbnail
    ? insight.frontmatter.insightThumbnail.publicURL
    : null;

  const frontmatter = insight.frontmatter;

  return (
    <Layout pageType="insight">
      <Seo
        title={`${frontmatter.insightTitle} | Winter's archive`}
        description={insight.excerpt}
        thumbnail={thumbnailUrl}
        slug={`/insights/${frontmatter.insightPostId}`}
        tags={frontmatter.insightTags}
        // 인사이트 전용 SEO 필드
        insightDescription={frontmatter.insightDescription}
        insightKeywords={frontmatter.insightKeywords}
        insightAuthor={nickname}
        insightDate={frontmatter.insightDate}
        insightModifiedDate={frontmatter.insightModifiedDate}
        type="article"
      />

      <div className="insight-detail-container">
        {/* Thumbnail 이미지 (있는 경우) */}
        {thumbnailUrl && (
          <div className="insight-detail-thumbnail">
            <img src={thumbnailUrl} alt={insight.frontmatter.insightTitle} />
          </div>
        )}

        {/* InsightFeedCard 재사용 (isDetailPage=true) */}
        <InsightFeedCard
          insight={{
            id: insight.id,
            html: insight.html,
            frontmatter: {
              insightPostId: insight.frontmatter.insightPostId,
              insightTitle: insight.frontmatter.insightTitle,
              insightDate: insight.frontmatter.insightDate,
              insightTags: insight.frontmatter.insightTags,
            },
            fields: {
              isTruncated: false, // 상세 페이지에서는 항상 false
            }
          }}
          authorData={authorData}
          isDetailPage={true}
          loadedCount={0} // 상세 페이지에서는 사용하지 않음
        />

        {/* Profile 컴포넌트 (with dividers) */}
        <ProfileWithDividers />

        {/* Utterances 댓글 */}
        {utterancesRepo && (
          <Utterances
            repo={utterancesRepo}
            path={`/insights/${insight.frontmatter.insightPostId}`}
          />
        )}
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
      excerpt(pruneLength: 500, truncate: true)
      rawMarkdownBody
      frontmatter {
        insightPostId
        insightTitle
        insightDate
        insightTags
        insightThumbnail {
          publicURL
        }
        # SEO 필드 추가 (인사이트 전용)
        insightDescription
        insightKeywords
        insightModifiedDate
      }
    }
    profileImage: file(relativePath: { eq: "profile.jpeg" }) {
      childImageSharp {
        gatsbyImageData(width: 48, height: 48, layout: FIXED)
      }
    }
    site {
      siteMetadata {
        author {
          nickname
          bio {
            role
          }
        }
        comments {
          utterances {
            repo
          }
        }
      }
    }
  }
`;

export default InsightDetailTemplate;
