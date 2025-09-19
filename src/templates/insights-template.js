import React, { useMemo, useCallback } from 'react';
import { navigate } from 'gatsby';

import Layout from '../layout';
import Seo from '../components/seo';
import Post from '../models/post';
import CategoryPageHeader from '../components/category-page-header';
import PostTabs from '../components/post-tabs';

function InsightsTemplate({ pageContext }) {
  const { publicEdges: publicEdges, currentCategory } = pageContext;
  const { categories } = pageContext;
  const currentTabIndex = useMemo(
    () => categories.findIndex((category) => category === currentCategory),
    [categories, currentCategory],
  );
  const posts = publicEdges.map(({ node }) => new Post(node));

  const onTabIndexChange = useCallback(
    (e, value) => {
      if (value === 0) return navigate(`/insights`);
      navigate(`/insights/${categories[value]}`);
    },
    [categories],
  );

  return (
    <Layout>
      <Seo title="Insights | 개발자 윈터" />
      <CategoryPageHeader title={categories[currentTabIndex]} subtitle={`${posts.length} insights`} />
      <PostTabs
        tabIndex={currentTabIndex}
        onChange={onTabIndexChange}
        tabs={categories}
        posts={posts}
      />
    </Layout>
  );
}

export default InsightsTemplate;