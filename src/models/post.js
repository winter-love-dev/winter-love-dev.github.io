export default class Post {
  constructor(node) {
    const { id, html, excerpt, frontmatter = {}, fields = {} } = node;
    const { slug } = fields;
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
  }
}