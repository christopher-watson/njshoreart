export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'CLICK GENERATE HERE (if you change it, make sure there are dashes in between words.. NO SPACES)',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    // {
    //   name: 'author',
    //   title: 'Author',
    //   type: 'reference',
    //   to: {type: 'author'},
    // },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    },
    // {
    //   name: 'publishedAt',
    //   title: 'Published at',
    //   type: 'datetime',
    // },
    {
      name: 'desc',
      title: 'Description',
      type: 'string',
      description: 'Make it catchy',
      // validation: Rule => Rule.max(120).warning(`A title shouldn't be more than 120 characters.`)
    },
    // {
    //   name: 'body',
    //   title: 'Body',
    //   type: 'blockContent',
    // },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`,
      })
    },
  },
}

