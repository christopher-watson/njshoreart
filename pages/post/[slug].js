import imageUrlBuilder from '@sanity/image-url';
import { useState, useEffect } from 'react';
import groq from 'groq'
import styles from '../../styles/Post.module.css';
import client from '../../client';
import { Nav } from '../../components/nav'

const Post = ({ post }) => {
  console.log(post);

  // const { mainImage, title, desc, categories } = post;
  const [imageUrl, setImageUrl] = useState('');
  const [postComponents, setPostComponents] = useState({})

  // useEffect(() => {
  //   if(post){
  //     const imageBuilder = imageUrlBuilder({
  //       projectId: 'zskt9act',
  //       dataset: 'production'
  //     })
  
  //     setImageUrl(imageBuilder.image(mainImage));
  //   }
  // }, [post]);

  useEffect(() => {
    if(post){
      setPostComponents({
        mainImage: post.mainImage,
        title: post.title,
        desc: post.desc,
        categories: post.categories
      })
      const imageBuilder = imageUrlBuilder({
        projectId: 'zskt9act',
        dataset: 'production'
      })
      setImageUrl(imageBuilder.image(post.mainImage));
    }
  },[post])

  return (
    <div className='postContainer'>
      {postComponents.title ? 
        <div>
          <Nav title={postComponents.title}/>
          <div className={styles.main}>
            <h1>{postComponents.title}</h1>
            { imageUrl && 
              <img className={styles.mainImage} src={imageUrl} alt={postComponents.title || 'njshoreart'}
              loading="lazy"/> 
            }
            <p className={styles.description}>
              {postComponents.desc}
            </p>
            {postComponents.categories && (
            <ul>
              {postComponents.categories.map(category => <div key={category}>#{category}</div>)}
            </ul>
          )}
          </div>
        </div> : <div>
          <Nav />
          No Posts Yet
        </div>
      }
    </div>
  )
}

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  mainImage,
  "categories": categories[]->title
}`

export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({params: {slug}})),
    fallback: true,
  }
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params
  const post = await client.fetch(query, { slug })

  return {
    props: {
      post
    }
  }
}

export default Post



// export const Post = ({ title, image, desc }) => {
//   console.log(title);
//   console.log(image);
//   console.log(desc);

//   const [imageUrl, setImageUrl] = useState('');

//   useEffect(() => {
//     const imageBuilder = imageUrlBuilder({
//       projectId: 'zskt9act',
//       dataset: 'production'
//     })

//     setImageUrl(imageBuilder.image(image));
//   }, [image]);

//   return (
//     <div className='postContainer'>
//       <div className={styles.main}>
//         <h1>{title}</h1>
//         { imageUrl && <img className={styles.mainImage} src={imageUrl} /> }
//       </div>
//     </div>
//   )
// }

// export const getServerSideProps = async pageContext => {
//   const pageSlug = pageContext.query.slug;

//   if (!pageSlug) {
//     console.log(`❌ no slug found`);
//     return {
//       notFound: true
//     }
//   }
  
//   const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
//   const url = `https://zskt9act.api.sanity.io/v1/data/query/production?query=${query}`;
  
//   const result = await fetch(url).then(res => res.json());
//   const post = result.result[0];
  
//   if (!post) {
//     console.log(`❌ no post found ${result}`);
//     return {
//       notFound: true
//     }
//   } else {
//     console.log(`🟢 post found ${result} `)
//     return {
//       props: {
//         title: post.title,
//         image: post.mainImage,
//         // categories: post.categories,
//         // desc: post.desc,
//       }
//     }
//   }

// }

// export default Post