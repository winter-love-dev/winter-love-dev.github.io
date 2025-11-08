import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import IconButtonBar from '../icon-button-bar';
import BuyMeACoffee from '../buy-me-a-coffee';
import './style.scss';

function HomeBio({ author }) {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "memoji_winter.PNG" }, sourceInstanceName: { eq: "assets" }) {
        publicURL
      }
    }
  `);

  if (!author) return null;
  const { bio, social } = author;

  return (
    <div className="bio">
      <div className="introduction korean">
        <div className="title">
          <strong>겨울과 위스키를 좋아하는</strong>
          <br />
          {bio.role}
          <br />
          <strong>Winter</strong> 입니다.
        </div>
        <div className="social-links">
          <IconButtonBar links={social} />
        </div>
        <br />
        <BuyMeACoffee />
      </div>
      <div className="thumbnail-wrapper">
        <img
          src={data.file.publicURL}
          alt="thumbnail"
          style={{ width: 250, height: 250, objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}

export default HomeBio;