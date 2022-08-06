import Link from 'next/link'
import groq from 'groq'
import client from '../client'
import styles from '../styles/Home.module.css'
import { Nav } from '../components/nav'
import imageUrlBuilder from '@sanity/image-url'
import { useState, useEffect } from 'react'

const Index = ({ posts }) => {
   // console.log(posts);

   const [mappedPosts, setMappedPosts] = useState([]);

   useEffect(() => {
      if (posts.length) {
         const imageBuilder = imageUrlBuilder({
            projectId: 'zskt9act',
            dataset: 'production'
         });
         setMappedPosts(
            posts.map(p => {
               return {
                  ...p,
                  mainImage: imageBuilder.image(p.mainImage),
                  // mainImage: imageBuilder.image(p.mainImage).width(500).height(250),
               }
            })
         )
      } else {
         setMappedPosts([]);
      }
   }, [posts]);

   return (
      <div className={styles.homeContainer}>
         <Nav title="Home" />
         <h1>Art Collection</h1>
         <main className={styles.homeMain}>
            {mappedPosts.length ? mappedPosts.map(({ title = '', slug = '', desc = '', mainImage = '', categories = '' }, index) => (
               <div key={index} className={styles.innerPost}>
                  <h2>{title}</h2>
                  <Link href="/post/[slug]" as={`/post/${slug.current}`}>
                     <a>
                        <img className={''} src={mainImage} alt={title || 'njshoreart'} loading="lazy" />
                     </a>
                  </Link>
                  {desc}
                  <div className={styles.categoryStyle}>
                     {categories.map((category) => (
                        <Link href="/category/[slug]" as={`/category/${category}`} key={category}>
                           <a>#{category}</a>
                        </Link>
                     ))}
                  </div>
               </div>
            )) : <div>
               <Nav />
               No Posts Yet
            </div>}
         </main>
      </div>
   )
}

export async function getStaticProps() {
   const posts = await client.fetch(groq`*[_type == "post"] | order(publishedAt asc){
    title,
    slug,
    desc,
    mainImage,
    "categories": categories[]->title
  }`)
   return {
      props: {
         posts
      }
   }
}

export default Index