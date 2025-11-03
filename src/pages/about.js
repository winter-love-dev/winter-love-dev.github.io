import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import Bio from '../components/bio';
import TimeStampSection from '../components/timestamp-section';
import ProjectSection from '../components/project-section';

function AboutPage({ data }) {
  useEffect(() => {
    runActionOnce();
  }, []);
  const metaData = data.site.siteMetadata;
  const { author, about } = metaData;
  const { timestamps, projects, career } = about;
  return (
    <Layout>
      <Seo title="About | Winter's archive" />
      <Bio author={author} />
      <TimeStampSection timestamps={timestamps} />
      <ProjectSection title="회사 프로젝트" projects={career} />
      <ProjectSection title="개인 프로젝트" projects={projects} />
    </Layout>
  );
}

export default AboutPage;

// 페이지 렌더링 후 약간 아래로 스크롤. 최초 {initialCount} 만큼만 실행됨.
const runActionOnce = ( initialCount = 3 ) => {
  const actionRunCount = parseInt(localStorage.getItem('action_run_count') || 0);
  if (actionRunCount < initialCount) {
    localStorage.setItem('action_run_count', actionRunCount + 1);  // 카운트 증가
    window.scrollTo({ top: 200, behavior: 'smooth' });  // 페이지 스크롤
  }
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author {
          name
          nickname
          bio {
            role
            description
            thumbnail
          }
          social {
            github
            linkedIn
            email
          }
        }

        about {
          timestamps {
            category
            date
            title
            subTitle
            content
            links {
              post
              github
              demo
              googlePlay
              appStore
            }
          }

          career {
            title
            description
            techStack
            thumbnailUrl
            links {
              post
              github
              demo
              googlePlay
              appStore
            }
          }

          projects {
            title
            description
            techStack
            thumbnailUrl
            links {
              post
              github
              demo
              googlePlay
              appStore
            }
          }
        }
      }
    }
  }
`;
