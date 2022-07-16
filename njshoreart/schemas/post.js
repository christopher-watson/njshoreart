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
      description: 'CLICK GENERATE (if you change it, make sure there are dashes in between words.. NO SPACES)',
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
      of: [{ type: 'reference', to: { type: 'category' } }],
    },
    {
      name: 'desc',
      title: 'Description',
      type: 'string',
      description: 'Make it catchy',
      // validation: Rule => Rule.max(120).warning(`A title shouldn't be more than 120 characters.`)
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    // {
    //   name: 'body',
    //   title: 'Body',
    //   type: 'blockContent',
    // },
  ],
  orderings: [
    {
      title: 'Publish Date',
      name: 'publishDateAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' }
      ]
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'publishedAt',
    },
    prepare(selection) {
      const { title, media, subtitle } = selection;
      const date = new Date(subtitle).toString().split('GMT')[0];
      // console.log(new Date(subtitle))
      return {
        title: title,
        media: media,
        subtitle: date, 
      }
    }

  }
}

