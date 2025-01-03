import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../layout';
import Seo from '../components/seo';
import ProjectSection from '../components/project-section';
import TimeStampSection from '../components/timestamp-section';

function ProjectsTemplate({ data }) {
  const metaData = data.site.siteMetadata;
  const { author, about, language } = metaData;
  const { timestamps, projects, career } = about;
  return (
    <Layout>
      <Seo title="개발자 윈터 | Projects" />
      <TimeStampSection timestamps={timestamps} />
      <ProjectSection title="회사 프로젝트" projects={career} />
      <ProjectSection title="개인 프로젝트" projects={projects} />
    </Layout>
  );
}

export default ProjectsTemplate;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        language
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
