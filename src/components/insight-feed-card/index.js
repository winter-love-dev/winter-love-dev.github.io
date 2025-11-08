import React from 'react';
import InsightFeedCardHeader from '../insight-feed-card-header';
import InsightFeedCardFooter from '../insight-feed-card-footer';
import InsightFeedContent from '../insight-feed-content';
import './style.scss';

const InsightFeedCard = ({
  insight,
  authorData,
  isDetailPage = false,
  loadedCount,
  onTagClick
}) => {
  if (!insight) return null;

  // authorData에서 props 추출
  const { profileImage, nickname, role } = authorData || {};

  const {
    frontmatter,
    html,
    fields
  } = insight;

  const {
    insightPostId,
    insightTitle,
    insightDate,
    insightTags
  } = frontmatter || {};

  const isTruncated = fields?.isTruncated || false;

  return (
    <article className="insight-feed-card">
      {/* Header: author, date, icons */}
      <InsightFeedCardHeader
        profileImage={profileImage}
        nickname={nickname}
        role={role}
        date={insightDate}
        postId={insightPostId}
        isDetailPage={isDetailPage}
        loadedCount={loadedCount}
      />

      {/* Title */}
      {insightTitle && !isDetailPage && (
        <div className="insight-feed-card__title">{insightTitle}</div>
      )}
      {insightTitle && isDetailPage && (
        <h1 className="insight-feed-card__title--detail">{insightTitle}</h1>
      )}

      {/* Body: 마크다운 컨텐츠 (코드 블록 포함) */}
      <InsightFeedContent
        html={html}
        isDetailPage={isDetailPage}
        isTruncated={isTruncated}
      />

      {/* Footer: "...더보기" 링크, tags */}
      <InsightFeedCardFooter
        postId={insightPostId}
        isTruncated={isTruncated}
        isDetailPage={isDetailPage}
        loadedCount={loadedCount}
        tags={insightTags}
        onTagClick={onTagClick}
      />
    </article>
  );
};

export default InsightFeedCard;
