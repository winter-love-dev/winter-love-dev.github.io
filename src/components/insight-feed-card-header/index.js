import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { IconButton, Tooltip } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './style.scss';

const InsightFeedCardHeader = ({
  profileImage,
  nickname,
  role,
  date,
  postId,
  isDetailPage = false,
  loadedCount
}) => {
  const [isShared, setIsShared] = useState(false);

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // Share 버튼 클릭
  const handleShare = () => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/insights/${postId}`
      : `/insights/${postId}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  // Book 아이콘 클릭 시 sessionStorage 저장
  const handleBookClick = () => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('insights-scroll', window.scrollY);
      if (loadedCount) {
        sessionStorage.setItem('insights-loaded-count', loadedCount);
      }
    }
  };

  // Back 버튼 클릭
  const handleBack = () => {
    navigate('/insights');
  };

  return (
    <div className="insight-feed-card-header">
      {/* Back 버튼 (상세 페이지에서만 표시) */}
      {isDetailPage && (
        <div className="insight-feed-card-header__back">
          <Tooltip title="목록으로" arrow>
            <IconButton
              size="small"
              onClick={handleBack}
              className="insight-icon-button"
            >
              <ArrowBackIcon className="insight-icon" />
            </IconButton>
          </Tooltip>
        </div>
      )}

      {/* 프로필 이미지 - 맨 왼쪽 */}
      {profileImage && (
        <div className="insight-feed-card-header__profile">
          <GatsbyImage
            image={profileImage}
            alt={nickname}
            className="insight-profile-image"
          />
        </div>
      )}

      {/* 중앙 컨텐츠 */}
      <div className="insight-feed-card-header__content">
        <div className="insight-feed-card-header__nickname">{nickname}</div>
        <div className="insight-feed-card-header__role">{role}</div>
        <div className="insight-feed-card-header__date">{formatDate(date)}</div>
      </div>

      {/* 우측 아이콘 */}
      <div className="insight-feed-card-header__actions">
        {!isDetailPage && (
          <Tooltip title="상세 보기" arrow>
            <IconButton
              size="small"
              component={Link}
              to={`/insights/${postId}`}
              onClick={handleBookClick}
              className="insight-icon-button"
            >
              <MenuBookIcon className="insight-icon" />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={isShared ? '복사 완료!' : 'URL 복사'} arrow>
          <IconButton
            size="small"
            onClick={handleShare}
            className="insight-icon-button"
          >
            {isShared ? (
              <CheckIcon className="insight-icon insight-icon--success" />
            ) : (
              <ShareIcon className="insight-icon" />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default InsightFeedCardHeader;