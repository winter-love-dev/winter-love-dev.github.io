import React from 'react';
import ReactRotatingText from 'react-rotating-text';
import IconButtonBar from '../icon-button-bar';
import BuyMeACoffee from '../buy-me-a-coffee';
import Image from '../image';
import './style.scss';

function Bio({ author, language = 'ko' }) {
  if (!author) return null;
  const { bio, social, name, nickname } = author;
  return (
    <div className="bio">
      {language === 'ko' ? (
        <div className="introduction korean">
          <div className="title">
            안녕하세요.
            <br />
            <strong>
              <ReactRotatingText
                typingInterval={100}
                deletingInterval={20}
                pause={1800}
                items={bio.description}
              />
            </strong>
            <br />
            {bio.role}
            <br />
            <strong>
              <ReactRotatingText items={[nickname, name]} /> 입니다.
            </strong>
          </div>
          <div className="social-links">
            <IconButtonBar links={social} />
          </div>
          <br />
          <BuyMeACoffee />
        </div>
      ) : (
        <div className="introduction english">
          <p className="title">
            Hello,
            <br />
            my name is
            <br />
            <strong>{name}</strong>
            .<br />
          </p>
          <p className="description">
            I'm a {bio.role} <ReactRotatingText items={bio.description} />
            <br />
          </p>
          <div className="social-links">
            <IconButtonBar links={social} />
          </div>
        </div>
      )}
      <div className="thumbnail-wrapper">
        <Image style={{ width: 250, height: 250 }} src={bio.thumbnail} alt="thumbnail" />
      </div>
    </div>
  );
}

export default Bio;
