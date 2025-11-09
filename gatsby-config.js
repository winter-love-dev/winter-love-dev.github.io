const { NODE_ENV, CONTEXT: NETLIFY_ENV = NODE_ENV } = process.env;

const metaConfig = require('./gatsby-meta-config');
const siteUrl = metaConfig.siteUrl;

module.exports = {
  siteMetadata: {
    ...metaConfig,
    siteUrl,
  },

  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/assets`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `insights`,
        path: `${__dirname}/insights`,
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap: [
          `${siteUrl}/sitemap-index.xml`,
          `${siteUrl}/sitemap-0.xml`,
        ],
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl,
      },
    },
    {
      resolve: `gatsby-plugin-google-adsense`,
      options: {
        publisherId: `ca-pub-5925353368498146`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "G-LMTR2L9LZS",
        head: true,
        enableWebVitalsTracking: true,
      }
    },
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: 'G-LMTR2L9LZS',
        head: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: metaConfig.title,
        short_name: metaConfig.title,
        description: metaConfig.description,
        lang: `en`,
        display: `standalone`,
        start_url: `/`,
        icon: `static/favicon.png`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 720,
              linkImagesToOriginal: false,
              backgroundColor: 'transparent',
            },
          },
          {
            resolve: `gatsby-remark-table-of-contents`,
            options: {
              exclude: 'Table of Contents',
              tight: false,
              ordered: false,
              fromHeading: 2,
              toHeading: 6,
              className: 'table-of-contents',
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false,
              },
              escapeEntities: {},
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        custom: {
          families: ["Pretendard"],
          urls: [
            "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css",
          ],
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes
                .filter(node => {
                  // 비공개 글 제외
                  const frontmatter = node.frontmatter;
                  return frontmatter.private !== true && frontmatter.insightPrivate !== true;
                })
                .map(node => {
                  const frontmatter = node.frontmatter;
                  const url = site.siteMetadata.siteUrl + node.fields.slug;

                  return {
                    title: frontmatter.insightTitle || frontmatter.title,
                    description: node.excerpt,
                    date: frontmatter.insightDate || frontmatter.date,
                    url,
                    guid: url,
                    custom_elements: [
                      { "content:encoded": node.html },
                    ],
                  };
                });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { frontmatter: { date: DESC } }
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                      private
                      insightTitle
                      insightDate
                      insightPrivate
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "winter-love.dev RSS Feed",
            description: "Winter's Archive / Blog",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark {
              nodes {
                frontmatter {
                  date
                  private
                  insightPrivate
                  insightDate
                }
                fields {
                  slug
                }
              }
            }
          }
        `,
        resolvePages: ({ allSitePage: { nodes: allPages }, allMarkdownRemark: { nodes: allPosts } }) => {
          const postMap = allPosts.reduce((acc, post) => {
            const { slug } = post.fields || {};
            if (slug) {
              acc[slug] = post;
            }
            return acc;
          }, {});

          return allPages.map(page => {
            const post = postMap[page.path];
            return {
              ...page,
              ...post,
            };
          });
        },
        serialize: ({ path, frontmatter }) => {
          // 비공개 글 제외
          if (frontmatter?.private === true || frontmatter?.insightPrivate === true) {
            return null;
          }

          // URL 우선순위 설정
          let priority = 0.5;
          let changefreq = 'weekly';

          if (path === '/') {
            priority = 1.0;
            changefreq = 'daily';
          } else if (path.startsWith('/articles/') || path.startsWith('/insights/')) {
            priority = 0.7;
            changefreq = 'weekly';
          } else if (path.startsWith('/about/') || path.startsWith('/tags/')) {
            priority = 0.6;
            changefreq = 'monthly';
          }

          // lastmod 설정 (최신 날짜 사용)
          const lastmod = frontmatter?.insightDate || frontmatter?.date;

          return {
            url: path,
            changefreq,
            priority,
            lastmod,
          };
        },
        excludes: ['/dev-404-page/', '/404/', '/404.html'],
      },
    },
    `gatsby-plugin-sass`,
  ],
};
