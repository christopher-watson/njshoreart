import Link from 'next/link';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react'
import { useState, useEffect } from 'react';
import groq from 'groq'
import styles from '../../styles/Category.module.css';
import client from '../../client';
import { Nav } from '../../components/nav'

const Category = ({ posts, slug }) => {
   // console.log(posts);
   const [mappedPosts, setMappedPosts] = useState([]);
   
   useEffect(() => {
      if (posts) {
         const imageBuilder = imageUrlBuilder({
            projectId: 'zskt9act',
            dataset: 'production'
         });
         // const filteredArray = posts.filter(p => p.categories !== null);
         setMappedPosts(
            posts.filter(p => p.categories !== null).map(p => {
               return {
                  ...p,
                  mainImage: imageBuilder.image(p.mainImage),
               }
            })
         )
      } else {
         setMappedPosts([]);
      }
   }, [posts]);


   return (
      <div className={styles.categoryContainer}>
         <Nav title={slug} />
         <h1>Art Collection | #{slug}</h1>
         <main>
            {mappedPosts ?
               <div className={styles.categoryMain}>
                  {mappedPosts.filter(mPost => mPost.categories.includes(slug)).map(({ title = '', slug = '', description = '', mainImage = '', categories = '' }, index) => (
                     <div key={index} className={styles.categoryPost}>
                        <h2>{title}</h2>
                        <Link href="/post/[slug]" as={`/post/${slug.current}`}>
                           <a>
                              <img className={''} src={mainImage} alt={title || 'njshoreart'} loading="lazy" />
                           </a>
                        </Link>
                        <div className={styles.description}>
                           <BlockContent className={styles.innerDescription} blocks={description} />
                        </div>
                        <div className={styles.categoryStyle}>
                           {categories.map((category) => (
                              <Link key={category} href="/category/[slug]" as={`/category/${category}`}>
                                 <a>#{category}</a>
                              </Link>
                           ))}
                        </div>
                     </div>
                  ))}
               </div> : <div>
                  <Nav />
                  No Posts Yet
               </div>}
         </main>
      </div>
   )
}

// const query = groq`*[_type == 'post']{
//   ...,
//   categories[]->{
//     title
//   }
// }`;

const query = groq`*[_type == "post"] | order(publishedAt asc){
  title,
  slug,
  description,
  mainImage,
  "categories": categories[]->title
}`;



export async function getStaticPaths() {
   const paths = await client.fetch(
      groq`*[_type == "post" && defined(slug.current)][].slug.current`
   )

   return {
      paths: paths.map((slug) => ({ params: { slug } })),
      fallback: true,
   }
}

export async function getStaticProps(context) {
   // It's important to default the slug so that it doesn't return "undefined"
   const { slug = "" } = context.params
   // console.log(context.params)
   const posts = await client.fetch(query, { slug })

   return {
      props: {
         posts,
         slug
      }
   }
}


export default Category