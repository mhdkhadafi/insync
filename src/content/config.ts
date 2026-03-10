import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Qionglu Lei'),
    excerpt: z.string().optional(),
    categories: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    category: z.enum(['Workshop', 'Forum', 'Talk', 'Other']),
    image: z.string().optional(),
  }),
});

export const collections = { blog, events };
