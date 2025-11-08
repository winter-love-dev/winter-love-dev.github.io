import React from 'react';
import { Link } from 'gatsby';
import './style.scss';

const InsightFeedCardFooter = ({
  postId,
  isTruncated,
  isDetailPage,
  loadedCount
}) => {
  // sessionStorage 저장 핸들러
  const handleReadMoreClick = () => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('insights-scroll', window.scrollY);
      if (loadedCount) {
        sessionStorage.setItem('insights-loaded-count', loadedCount);
      }
    }
  };

  // 상세 페이지이거나 잘리지 않은 경우 footer 표시 안 함
  if (isDetailPage || !isTruncated) {
    return null;
  }

  return (
    <div className="insight-feed-card-footer">
      <Link
        to={`/insights/${postId}`}
        className="insight-feed-card-footer__read-more"
        onClick={handleReadMoreClick}
      >
        ...더보기
      </Link>
    </div>
  );
};

export default InsightFeedCardFooter;
