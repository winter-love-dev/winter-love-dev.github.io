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
    postId,
    title,
    date,
    tags
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
        date={date}
        tags={tags}
        postId={postId}
        isDetailPage={isDetailPage}
        loadedCount={loadedCount}
      />

      {/* Title */}
      {title && !isDetailPage && (
        <div className="insight-feed-card__title">{title}</div>
      )}
      {title && isDetailPage && (
        <h1 className="insight-feed-card__title--detail">{title}</h1>
      )}

      {/* Body: 마크다운 컨텐츠 (코드 블록 포함) */}
      <InsightFeedContent html={displayHtml} />

      {/* Footer: "...더보기" 링크 */}
      <InsightFeedCardFooter
        postId={postId}
        isTruncated={isTruncated}
        isDetailPage={isDetailPage}
        loadedCount={loadedCount}
      />
    </article>
  );
};

export default InsightFeedCard;
