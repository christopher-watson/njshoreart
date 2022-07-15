// client.js
import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'zskt9act', // you can find this in sanity.json
  dataset: 'production', // or the name you chose in step 1
})