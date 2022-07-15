import Link from 'next/link'
import groq from 'groq'
import client from '../client'
import styles from '../styles/Home.module.css'
import { Nav } from '../components/nav'
import imageUrlBuilder from '@sanity/image-url'
import { useState, useEffect } from 'react'

const Index = ({ posts }) => {
  console.log(posts);

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
    <div className={styles.container}>
      <Nav title="Home" />
      <main className={styles.main}>
        <h1>NJ Shore Art</h1>
        {mappedPosts.length ? mappedPosts.map(({ title = '', slug = '', desc = '', mainImage = '' }, index) => (
          <div key={index} className={styles.postStyle}>
            <Link href="/post/[slug]" as={`/post/${slug.current}`}>
              <div>{title}</div>
            </Link>
            <img className={''} src={mainImage} alt={title || 'njshoreart'}
              loading="lazy" />
            <div>{desc}</div>
          </div>
        )) : <>No Posts Yet</>}
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const posts = await client.fetch(groq`*[_type == "post"]`)
  return {
    props: {
      posts
    }
  }
}

export default Index