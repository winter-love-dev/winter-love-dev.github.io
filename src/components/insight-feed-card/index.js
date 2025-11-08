import React from 'react';
import InsightFeedCardHeader from '../insight-feed-card-header';
import InsightFeedCardFooter from '../insight-feed-card-footer';
import InsightFeedContent from '../insight-feed-content';
import './style.scss';

const InsightFeedCard = ({
  insight,
  isDetailPage = false,
  loadedCount
}) => {
  if (!insight) return null;

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
  const truncatedHtml = fields?.truncatedHtml || '';

  // 표시할 HTML 결정
  const displayHtml = isDetailPage ? html : (truncatedHtml || html);

  return (
    <article className="insight-feed-card">
      {/* Header: author, date, tags, icons */}
      <InsightFeedCardHeader
        author="Winter"
        date={insightDate}
        tags={insightTags}
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
      <InsightFeedContent html={displayHtml} />

      {/* Footer: "...더보기" 링크 */}
      <InsightFeedCardFooter
        postId={insightPostId}
        isTruncated={isTruncated}
        isDetailPage={isDetailPage}
        loadedCount={loadedCount}
      />
    </article>
  );
};

export default InsightFeedCard;
