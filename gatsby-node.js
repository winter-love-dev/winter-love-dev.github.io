const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');
const { marked } = require('marked');
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

// Prism.js 언어 로드
loadLanguages(['kotlin', 'javascript', 'typescript', 'java', 'python', 'bash']);

// Marked에 Prism.js 적용을 위한 커스텀 렌더러
const renderer = new marked.Renderer();
const originalCodeRenderer = renderer.code.bind(renderer);

renderer.code = function(code, language) {
  // 언어가 지정되고 Prism이 지원하는 경우
  if (language && Prism.languages[language]) {
    try {
      const highlighted = Prism.highlight(code, Prism.languages[language], language);
      return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`;
    } catch (e) {
      console.error('Prism highlight error:', e);
      return originalCodeRenderer(code, language);
    }
  }
  // 언어가 없거나 지원하지 않는 경우 기본 렌더링
  return originalCodeRenderer(code, language);
};

marked.setOptions({
  renderer: renderer
});

// Helper function: 20줄 제한 로직
const truncateMarkdown = (rawMarkdownBody, maxLines = 20) => {
  if (!rawMarkdownBody) return { isTruncated: false, truncatedContent: '', lineCount: 0 };

  // frontmatter 제거
  const contentWithoutFrontmatter = rawMarkdownBody.replace(/^---[\s\S]*?---\n/, '');
  const lines = contentWithoutFrontmatter.split('\n');

  let lineCount = 0;
  let truncatedLines = [];
  let inCodeBlock = false;
  let isTruncated = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 코드 블록 시작/종료 감지
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        truncatedLines.push(line);
        lineCount++;
      } else {
        inCodeBlock = false;
        truncatedLines.push(line);
        lineCount++;
      }

      if (lineCount >= maxLines) {
        if (inCodeBlock) {
          truncatedLines.push('```'); // 코드 블록 강제 종료
        }
        isTruncated = true;
        break;
      }
      continue;
    }

    // 이미지 감지 (![...](...) 패턴)
    if (line.trim().match(/^!\[.*\]\(.*\)$/)) {
      lineCount++; // 이미지는 1 line
      truncatedLines.push(line);

      if (lineCount >= maxLines) {
        isTruncated = true;
        break;
      }
      continue;
    }

    // 일반 라인 (코드 블록 내부 포함)
    lineCount++;
    truncatedLines.push(line);

    if (lineCount >= maxLines) {
      if (inCodeBlock) {
        truncatedLines.push('```'); // 코드 블록 강제 종료
      }
      isTruncated = true;
      break;
    }
  }

  return {
    isTruncated: isTruncated || lineCount > maxLines,
    truncatedContent: truncatedLines.join('\n'),
    lineCount,
  };
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` });
    createNodeField({ node, name: `slug`, value: slug });

    // Insight 노드에만 truncated 필드 추가
    const fileNode = getNode(node.parent);
    if (fileNode && fileNode.absolutePath && fileNode.absolutePath.includes('/insights/')) {
      const { isTruncated, truncatedContent } = truncateMarkdown(node.rawMarkdownBody, 20);

      // truncated markdown을 HTML로 변환
      const truncatedHtml = marked(truncatedContent);

      createNodeField({ node, name: `isTruncated`, value: isTruncated });
      createNodeField({ node, name: `truncatedHtml`, value: truncatedHtml });
    }
  }
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, ''),
      },
    },
  });
};

const createBlogPages = ({ createPage, publicEdges }) => {
  const blogPostTemplate = require.resolve(`./src/templates/content-template.js`);
  publicEdges.forEach(({ node, next, previous }) => {
    createPage({
      path: node.fields.slug,
      component: blogPostTemplate,
      context: {
        slug: node.fields.slug,
        nextSlug: next?.fields.slug ?? '',
        prevSlug: previous?.fields.slug ?? '',
      },
    });
  });
};

const createArticlesPages = ({ createPage, publicEdges }) => {
  const categoryTemplate = require.resolve(`./src/templates/category-template.js`);
  const categorySet = new Set(['All']);

  publicEdges.forEach(({ node }) => {
    const postCategories = node.frontmatter.categories.split(' ');
    postCategories.forEach((category) => categorySet.add(category));
  });

  const categories = [...categorySet];

  createPage({
    path: `/articles`,
    component: categoryTemplate,
    context: { currentCategory: 'All', publicEdges, categories },
  });

  categories.forEach((currentCategory) => {
    createPage({
      path: `/articles/${currentCategory}`,
      component: categoryTemplate,
      context: {
        currentCategory,
        categories,
        publicEdges: publicEdges.filter(({ node }) => node.frontmatter.categories.includes(currentCategory)),
      },
    });
  });
};

// Helper function: 20줄 제한 로직
const truncateContent = (rawMarkdownBody, maxLines = 20) => {
  if (!rawMarkdownBody) return { isTruncated: false, truncatedContent: '', lineCount: 0 };

  // frontmatter 제거
  const contentWithoutFrontmatter = rawMarkdownBody.replace(/^---[\s\S]*?---\n/, '');
  const lines = contentWithoutFrontmatter.split('\n');

  let lineCount = 0;
  let truncatedLines = [];
  let inCodeBlock = false;
  let isTruncated = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 코드 블록 시작/종료 감지
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        truncatedLines.push(line);
        lineCount++;
      } else {
        inCodeBlock = false;
        truncatedLines.push(line);
        lineCount++;
      }

      if (lineCount >= maxLines) {
        if (inCodeBlock) {
          truncatedLines.push('```'); // 코드 블록 강제 종료
        }
        isTruncated = true;
        break;
      }
      continue;
    }

    // 이미지 감지 (![...](...) 패턴)
    if (line.trim().match(/^!\[.*\]\(.*\)$/)) {
      lineCount++; // 이미지는 1 line
      truncatedLines.push(line);

      if (lineCount >= maxLines) {
        isTruncated = true;
        break;
      }
      continue;
    }

    // 일반 라인 (코드 블록 내부 포함)
    lineCount++;
    truncatedLines.push(line);

    if (lineCount >= maxLines) {
      if (inCodeBlock) {
        truncatedLines.push('```'); // 코드 블록 강제 종료
      }
      isTruncated = true;
      break;
    }
  }

  return {
    isTruncated: isTruncated || lineCount > maxLines,
    truncatedContent: truncatedLines.join('\n'),
    lineCount,
  };
};

// Insight 목록 페이지 생성 (category 없음)
const createInsightListPage = ({ createPage }) => {
  const insightsTemplate = require.resolve(`./src/pages/insights.js`);

  createPage({
    path: `/insights`,
    component: insightsTemplate,
  });
};

// Insight 상세 페이지 생성
const createInsightDetailPages = ({ createPage, insightEdges }) => {
  const insightDetailTemplate = require.resolve(`./src/templates/insight-detail-template.js`);

  insightEdges.forEach(({ node }) => {
    const postId = node.frontmatter.postId;

    // 20줄 제한 로직 적용
    const { isTruncated, truncatedContent } = truncateContent(node.rawMarkdownBody, 20);

    createPage({
      path: `/insights/${postId}`,
      component: insightDetailTemplate,
      context: {
        postId,
        isTruncated,
        truncatedContent,
        maxLines: 20,
      },
    });
  });
};

const createProjectsPages = ({ createPage }) => {
  const projectsTemplate = path.resolve(`./src/templates/projects-template.js`);

  createPage({
    path: `/projects`,
    component: projectsTemplate,
  });
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  // ===== Article 프로세스 =====
  const articleResults = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { private: { ne: true } }
          fileAbsolutePath: { regex: "/content/" }
        }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            id
            excerpt(pruneLength: 500, truncate: true)
            fields {
              slug
            }
            frontmatter {
              categories
              title
              date(formatString: "MMMM DD, YYYY")
              private
            }
          }
          next {
            fields {
              slug
            }
          }
          previous {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (articleResults.errors) {
    reporter.panicOnBuild(`Error while running Article GraphQL query.`);
    return;
  }

  const articleEdges = articleResults.data.allMarkdownRemark.edges;
  const publicArticleEdges = articleEdges.filter(({ node }) => !node.frontmatter.private);

  createBlogPages({ createPage, publicEdges: publicArticleEdges });
  createArticlesPages({ createPage, publicEdges: publicArticleEdges });

  // ===== Insight 프로세스 =====
  const insightResults = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { private: { ne: true } }
          fileAbsolutePath: { regex: "/insights/" }
        }
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            id
            rawMarkdownBody
            frontmatter {
              postId: post_id
              title
              date
              tags
              private
            }
          }
        }
      }
    }
  `);

  if (insightResults.errors) {
    reporter.panicOnBuild(`Error while running Insight GraphQL query.`);
    return;
  }

  const insightEdges = insightResults.data.allMarkdownRemark.edges;
  const publicInsightEdges = insightEdges.filter(({ node }) => !node.frontmatter.private);

  createInsightListPage({ createPage });
  createInsightDetailPages({ createPage, insightEdges: publicInsightEdges });

  // ===== Projects 페이지 =====
  createProjectsPages({ createPage });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type MarkdownRemarkFrontmatter {
      thumbnail: File @fileByRelativePath
      post_id: String
      tags: [String]
    }
  `)
}