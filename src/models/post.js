export default class Post {
  constructor(node) {
    const { id, html, excerpt, frontmatter = {}, fields = {}, fileAbsolutePath } = node;
    const { slug } = fields;

    // Article/Insight 구분
    const isInsight = fileAbsolutePath && fileAbsolutePath.includes('/insights/');

    if (isInsight) {
      // Insight 필드 사용
      const { insightTitle, insightDate, insightTags, insightPostId } = frontmatter;

      this.id = id;
      this.excerpt = excerpt;
      this.html = html;
      this.slug = `/insights/${insightPostId}`;
      this.title = insightTitle;
      this.date = insightDate;
      this.categories = [];
      this.tags = Array.isArray(insightTags) ? insightTags : [];
      this.isInsight = true;
    } else {
      // Article 필드 사용
      const { emoji, categories, title, author, date, thumbnail, tags } = frontmatter;

      this.id = id;
      this.excerpt = excerpt;
      this.emoji = emoji;
      this.html = html;
      this.slug = slug;
      this.title = title;
      this.author = author;
      this.date = date;
      this.categories = categories ? categories.split(' ') : [];
      this.thumbnail = thumbnail;
      this.tags = Array.isArray(tags) ? tags : [];
      this.isInsight = false;
    }
  }
}