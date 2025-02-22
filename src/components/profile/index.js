import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import "./style.scss";

const Profile = () => {
  // GraphQL로 siteMetadata와 프로필 이미지 가져오기
  const data = useStaticQuery(graphql`
    query ProfileDataQuery {
      profileImage: file(relativePath: { eq: "profile.jpeg" }) {
        childImageSharp {
          gatsbyImageData(width: 100, height: 100, layout: CONSTRAINED)
        }
      }
      site {
        siteMetadata {
          author {
            nameEn
            nickname
            bio {
              role
              description
              residence
            }
            social {
              github
              linkedIn
              email
            }
          }
        }
      }
    }
  `);

  const profileImage = getImage(data.profileImage);
  const { nameEn, nickname, bio, social } = data.site.siteMetadata.author;

  return (
    <div className="profile-wrapper">
      <div className="profile-image">
        {profileImage && (
          <GatsbyImage image={profileImage} alt="Index" className="profile-img" />
        )}
      </div>
      <div className="profile-name">About {nickname}, {nameEn}</div>
      <div className="profile-role">{bio.role}</div>
      <div className="profile-description">
        {bio.description.map((desc, index) => (
          <span key={index} className="description-item">
            {desc}
          </span>
        ))}
      </div>
      <div className="profile-residence">{bio.residence}</div>
      <div className="profile-links">
        {social.github && (
          <a href={social.github} target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="social-icon"
            >
              <path
                fill="currentColor"
                d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
              />
            </svg>
          </a>
        )}
        {social.linkedIn && (
          <a href={social.linkedIn} target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="social-icon"
            >
              <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
              />
            </svg>
          </a>
        )}
        {social.email && (
          <a href={`mailto:${social.email}`} target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="social-icon"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default Profile;