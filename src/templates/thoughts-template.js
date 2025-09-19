import React, { useMemo, useCallback } from 'react';
import { navigate } from 'gatsby';

import Layout from '../layout';
import Seo from '../components/seo';
import Post from '../models/post';
import CategoryPageHeader from '../components/category-page-header';
import PostTabs from '../components/post-tabs';

function ThoughtsTemplate({ pageContext }) {
  const { publicEdges: publicEdges, currentCategory } = pageContext;
  const { categories } = pageContext;
  const currentTabIndex = useMemo(
    () => categories.findIndex((category) => category === currentCategory),
    [categories, currentCategory],
  );
  const posts = publicEdges.map(({ node }) => new Post(node));

  const onTabIndexChange = useCallback(
    (e, value) => {
      if (value === 0) return navigate(`/thoughts`);
      navigate(`/thoughts/${categories[value]}`);
    },
    [categories],
  );

  return (
    <Layout>
      <Seo title="Thoughts | 개발자 윈터" />
      <CategoryPageHeader title={categories[currentTabIndex]} subtitle={`${posts.length} thoughts`} />
      <PostTabs
        tabIndex={currentTabIndex}
        onChange={onTabIndexChange}
        tabs={categories}
        posts={posts}
      />
    </Layout>
  );
}

export default ThoughtsTemplate;