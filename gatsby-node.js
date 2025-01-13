const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `content` });
    createNodeField({ node, name: `slug`, value: slug });
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
  const blogPostTemplate = require.resolve(`./src/templates/content-template/index.js`);
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

const createPostsPages = ({ createPage, publicEdges }) => {
  const categoryTemplate = require.resolve(`./src/templates/category-template.js`);
  const categorySet = new Set(['All']);

  publicEdges.forEach(({ node }) => {
    const postCategories = node.frontmatter.categories.split(' ');
    postCategories.forEach((category) => categorySet.add(category));
  });

  const categories = [...categorySet];

  createPage({
    path: `/posts`,
    component: categoryTemplate,
    context: { currentCategory: 'All', publicEdges, categories },
  });

  categories.forEach((currentCategory) => {
    createPage({
      path: `/posts/${currentCategory}`,
      component: categoryTemplate,
      context: {
        currentCategory,
        categories,
        publicEdges: publicEdges.filter(({ node }) => node.frontmatter.categories.includes(currentCategory)),
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

  const results = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { private: { ne: true } } }
        sort: { order: DESC, fields: [frontmatter___date] }, 
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

  // Handle errors
  if (results.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const edges = results.data.allMarkdownRemark.edges;
  const publicEdges = edges.filter(({ node }) => !node.frontmatter.private);
  createBlogPages({ createPage, publicEdges });
  createPostsPages({ createPage, publicEdges });
  createProjectsPages({ createPage });
};
