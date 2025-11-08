import { Link } from 'gatsby';
import React from 'react';
import './style.scss';

function HomeArticleCard({ post }) {
  const { title, date, categories } = post.frontmatter;
  const { slug } = post.fields;
  const description = post.excerpt;

  // categories가 문자열이면 배열로 변환
  const categoryList = Array.isArray(categories)
    ? categories
    : categories
      ? [categories]
      : [];

  return (
    <div className="home-article-card-wrapper">
      <Link className="home-article-card" to={slug}>
        <div className="title">{title}</div>
        {description && <p className="description">{description}</p>}
        <div className="info">
          <div className="date">{date}</div>
          <div className="categories">
            {categoryList.map((category) => (
              <span className="category" key={category}>
                {category}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HomeArticleCard;
