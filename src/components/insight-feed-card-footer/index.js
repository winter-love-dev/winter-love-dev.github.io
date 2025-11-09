import React from 'react';
import { Link, navigate } from 'gatsby';
import { Chip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './style.scss';

const InsightFeedCardFooter = ({
  postId,
  isTruncated,
  isDetailPage,
  loadedCount,
  tags = [],
  onTagClick
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

  return (
    <div className={`insight-feed-card-footer ${isDetailPage ? 'insight-feed-card-footer--detail' : ''}`}>
      {/* 더보기 버튼 - 목록 페이지에서 잘린 경우만 표시 */}
      {!isDetailPage && isTruncated && (
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

      {/* 태그 영역 - 목록 페이지에서 태그가 있을 때만 표시 */}
      {!isDetailPage && tags && tags.length > 0 && (
        <div className="insight-feed-card-footer__tags">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              size="small"
              className="insight-tag-chip"
              onClick={() => {
                if (onTagClick) {
                  onTagClick(tag);
                } else {
                  // fallback: 직접 네비게이션
                  navigate(`/insights?tag=${encodeURIComponent(tag)}`);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* 디테일 페이지 - 태그 영역 */}
      {isDetailPage && tags && tags.length > 0 && (
        <div className="insight-feed-card-footer__tags">
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={`#${tag}`}
              size="small"
              className="insight-tag-chip"
              onClick={() => {
                if (onTagClick) {
                  onTagClick(tag);
                } else {
                  // fallback: 직접 네비게이션
                  navigate(`/insights?tag=${encodeURIComponent(tag)}`);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Spacer with 뒤로가기 버튼 - 디테일 페이지에서만 표시 */}
      {isDetailPage && (
        <div className="insight-feed-card-footer__spacer">
          <button
            onClick={() => navigate('/insights')}
            className="insight-back-button"
          >
            <ArrowBackIcon style={{ fontSize: '18px' }} />
            Read other insights
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightFeedCardFooter;
