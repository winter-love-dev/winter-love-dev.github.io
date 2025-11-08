import { Link } from 'gatsby';
import React from 'react';
import './style.scss';

function HomeInsightCard({ insight }) {
  const { insightPostId, insightTitle, insightDate, insightTags } = insight.frontmatter;
  const insightUrl = `/insights/${insightPostId}`;
  const description = insight.excerpt;

  // 날짜 포맷팅 (YYYY.MM.DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formattedDate = formatDate(insightDate);

  return (
    <div className="home-insight-card-wrapper">
      <Link className="home-insight-card" to={insightUrl}>
        <div className="title">{insightTitle}</div>
        {description && <p className="description">{description}</p>}
        <div className="info">
          <div className="date">{formattedDate}</div>
          <div className="tags">
            {insightTags && insightTags.map((tag) => (
              <span className="tag" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HomeInsightCard;
