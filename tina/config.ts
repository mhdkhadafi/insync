import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: process.env.HEAD || 'main',
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'assets',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog Posts',
        path: 'src/content/blog',
        format: 'md',
        fields: [
          { name: 'title', type: 'string', label: 'Title', required: true },
          { name: 'date', type: 'datetime', label: 'Date', required: true },
          { name: 'author', type: 'string', label: 'Author', ui: { defaultValue: 'Qionglu Lei' } },
          { name: 'excerpt', type: 'string', label: 'Excerpt', ui: { component: 'textarea' } },
          { name: 'categories', type: 'string', label: 'Categories', list: true },
          { name: 'image', type: 'image', label: 'Cover Image' },
          { name: 'body', type: 'rich-text', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'event',
        label: 'Events',
        path: 'src/content/events',
        format: 'md',
        fields: [
          { name: 'title', type: 'string', label: 'Title', required: true },
          { name: 'date', type: 'datetime', label: 'Start Date & Time', required: true },
          { name: 'endDate', type: 'datetime', label: 'End Date & Time' },
          { name: 'location', type: 'string', label: 'Location' },
          {
            name: 'category',
            type: 'string',
            label: 'Category',
            options: ['Workshop', 'Forum', 'Talk', 'Other'],
          },
          { name: 'image', type: 'image', label: 'Event Image' },
          { name: 'body', type: 'rich-text', label: 'Description', isBody: true },
        ],
      },
    ],
  },
});
