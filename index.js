import { createClient } from "@astrajs/collections"

// import express and dotenv package installed above
import express from 'express'
import dotenv from 'dotenv'

// instantiate our express app
const app = express()


// enable json and url encoded data
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// enable env varibales for .env file
dotenv.config()

// create an Astra DB client
const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
  });


  const collection = astraClient.namespace("blog").collection("testcollection")

  // post route
app.post('/new', async(req, res) => {
    const {title, description, author} = req.body
    const newUser = await collection.create({
      author: author,
      description: description,
      title: title
    })
      // return a success msg with the new doc 
    return res.json({data: newUser, msg: 'user created successfully'})
  });

  // updating docs
app.put('/update', async(req, res)=>{
    const {title, description, author} = req.body
  const updatedUser = await collection.update("1b4a845d-7460-4971-a8a7-0ef371771d85", {
      title: title,
      description: description,
      author: author
    })
  
    return res.json({data: updatedUser, msg: 'user updated successfully'})
  });

  app.delete('/delete', async(req,res)=>{
    const user = await collection.delete("1b4a845d-7460-4971-a8a7-0ef371771d85")
  
    if(!user){
      return res.json({msg: '404 user not found'})
    }
  
    return res.json({msg: 'user deleted successfuly'})
  });

  // get all documents
app.get('/blogs', async (req, res) => {
    const blogs = await collection.find({})
    return res.json(blogs)
  });

// a basic index route
app.get('/', (req,res)=>{
  res.send("You're in the index page")
});

// run application on Port:: 5000
app.listen(5000, () => {
    console.log(`server running: port:: 5000`)
});