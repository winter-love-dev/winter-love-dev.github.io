import React from 'react';
import { Link } from 'gatsby';
import { Chip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './style.scss';

const InsightFeedCardFooter = ({
  postId,
  isTruncated,
  isDetailPage,
  loadedCount,
  tags = []
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

  // footer는 항상 표시 (tags 때문에)
  // 단, 상세 페이지에서는 표시 안 함
  if (isDetailPage) {
    return null;
  }

  return (
    <div className="insight-feed-card-footer">
      {/* 더보기 버튼 - 잘린 경우만 표시 */}
      {isTruncated && (
        <div className="insight-feed-card-footer__read-more-wrapper">
          <Link
            to={`/insights/${postId}`}
            className="insight-read-more-button"
            onClick={handleReadMoreClick}
          >
            <MenuBookIcon className="insight-read-more-button__icon" />
            Read more
          </Link>
        </div>
      )}

      {/* 태그 - 우측 정렬 */}
      {tags && tags.length > 0 && (
        <div className="insight-feed-card-footer__tags">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              className="insight-tag-chip"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightFeedCardFooter;
