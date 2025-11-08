import React from 'react';
import { Link } from 'gatsby';
import InsightFeedCardHeader from './InsightFeedCardHeader';
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

  // sessionStorage 저장 핸들러
  const handleReadMoreClick = () => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('insights-scroll', window.scrollY);
      if (loadedCount) {
        sessionStorage.setItem('insights-loaded-count', loadedCount);
      }
    }
  };

  return (
    <article className="insight-feed-card">
      <InsightFeedCardHeader
        author="Winter"
        date={date}
        tags={tags}
        postId={postId}
        isDetailPage={isDetailPage}
        loadedCount={loadedCount}
      />

      {isDetailPage && title && (
        <h1 className="insight-feed-card__title">{title}</h1>
      )}

      <div
        className="insight-feed-card__content"
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />

      {!isDetailPage && isTruncated && (
        <Link
          to={`/insights/${postId}`}
          className="insight-feed-card__read-more"
          onClick={handleReadMoreClick}
        >
          ...더보기
        </Link>
      )}
    </article>
  );
};

export default InsightFeedCard;
