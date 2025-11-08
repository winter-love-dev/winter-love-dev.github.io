import React, { useState, useEffect, useRef, useMemo } from 'react';
import { graphql } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';
import Layout from '../layout';
import Seo from '../components/seo';
import InsightFeedCard from '../components/insight-feed-card';
import './insights.scss';

// 빈 상태 메시지 컴포넌트
const EmptyMessage = () => {
  return (
    <div className="insights-empty-message">
      모든 인사이트를 확인하셨어요 🤗
    </div>
  );
};

const InsightsPage = ({ data }) => {
  const allInsights = useMemo(() => data.allMarkdownRemark.edges.map(({ node }) => node), [data.allMarkdownRemark.edges]);

  // Author 메타데이터 (한 번만 추출)
  const profileImage = getImage(data.profileImage);
  const { nickname, bio } = data.site.siteMetadata.author;
  const authorData = { profileImage, nickname, role: bio.role };
  const PAGE_SIZE = 5;
  const INITIAL_LOAD = 5; // 초기 로드는 5개 (화면을 확실히 채우기 위해)

  // 무한 스크롤 상태
  const [displayedInsights, setDisplayedInsights] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Intersection Observer ref
  const observerTarget = useRef(null);
  const allInsightsRef = useRef(allInsights);
  const pageSizeRef = useRef(PAGE_SIZE);
  const hasMoreRef = useRef(hasMore);
  const currentPageRef = useRef(currentPage);

  // refs 업데이트
  useEffect(() => {
    allInsightsRef.current = allInsights;
    hasMoreRef.current = hasMore;
    currentPageRef.current = currentPage;
  }, [allInsights, hasMore, currentPage]);

  // sessionStorage 스크롤 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedScroll = sessionStorage.getItem('insights-scroll');
    const savedLoadedCount = sessionStorage.getItem('insights-loaded-count');

    if (savedLoadedCount) {
      // 저장된 개수만큼 미리 로드
      const loadedCount = parseInt(savedLoadedCount, 10);
      const initialDisplayed = allInsights.slice(0, loadedCount);
      setDisplayedInsights(initialDisplayed);
      setCurrentPage(Math.ceil(loadedCount / PAGE_SIZE));
      setHasMore(loadedCount < allInsights.length);

      // 스크롤 위치 복원
      if (savedScroll) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
        }, 100);
      }

      // sessionStorage 초기화
      sessionStorage.removeItem('insights-scroll');
      sessionStorage.removeItem('insights-loaded-count');
    } else {
      // 초기 로드 (처음 5개 - 화면을 채우기 위해)
      const initialDisplayed = allInsights.slice(0, INITIAL_LOAD);
      setDisplayedInsights(initialDisplayed);
      setCurrentPage(Math.ceil(INITIAL_LOAD / PAGE_SIZE));
      setHasMore(allInsights.length > INITIAL_LOAD);
    }
  }, [allInsights]);

  // Intersection Observer 설정 - 딱 한 번만 생성
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current) {
          console.log('Intersection Observer triggered - loading more...');

          // loadMore 로직 (모든 값을 ref에서 가져옴)
          const nextPage = currentPageRef.current + 1;
          const startIndex = 0;
          const endIndex = nextPage * pageSizeRef.current;
          const newDisplayed = allInsightsRef.current.slice(startIndex, endIndex);

          setDisplayedInsights(newDisplayed);
          setCurrentPage(nextPage);
          setHasMore(endIndex < allInsightsRef.current.length);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      console.log('Observer attached to target');
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []); // 빈 배열 - 딱 한 번만 실행!

  // 빈 상태 처리
  if (allInsights.length === 0) {
    return (
      <Layout pageType="insight">
        <Seo title="Insights | Winter's archive" />
        <EmptyMessage />
      </Layout>
    );
  }

  return (
    <Layout pageType="insight">
      <Seo title="Insights | Winter's archive" />

      <div className="insights-container">
        {displayedInsights.map((insight, index) => (
          <InsightFeedCard
            key={insight.id}
            insight={insight}
            authorData={authorData}
            isDetailPage={false}
            loadedCount={displayedInsights.length}
          />
        ))}

        {/* Intersection Observer 타겟 */}
        {hasMore && (
          <div ref={observerTarget} style={{ height: '20px' }} />
        )}

        {/* 더 이상 글이 없을 때 */}
        {!hasMore && displayedInsights.length > 0 && (
          <EmptyMessage />
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query InsightsListQuery {
    allMarkdownRemark(
      filter: {
        frontmatter: { insightPrivate: { ne: true } }
        fileAbsolutePath: { regex: "/insights/" }
      }
      sort: { order: DESC, fields: [frontmatter___insightDate] }
    ) {
      edges {
        node {
          id
          html
          fields {
            isTruncated
          }
          frontmatter {
            insightPostId
            insightTitle
            insightDate
            insightTags
            insightPrivate
          }
        }
      }
    }
    profileImage: file(relativePath: { eq: "profile.jpeg" }) {
      childImageSharp {
        gatsbyImageData(width: 48, height: 48, layout: FIXED)
      }
    }
    site {
      siteMetadata {
        author {
          nickname
          bio {
            role
          }
        }
      }
    }
  }
`;

export default InsightsPage;
