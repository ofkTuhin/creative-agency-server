const express = require('express')

const cors=require('cors')
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
port=5000

const uri = "mongodb+srv://omar:faruk12345@cluster0.gqnwo.mongodb.net/cerativeAgency?retryWrites=true&w=majority";




const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@cluster0.gqnwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const reviewCollection = client.db("cerativeAgency").collection("review");
  const serviceCollection = client.db("cerativeAgency").collection("service");
  app.post('/addReview',(req,res)=>{
    console.log(req.body)
    reviewCollection.insertOne(req.body)
  })

  app.get('/getReview',(req,res)=>{
    reviewCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })


  app.post('/addService',(req,res)=>{
    console.log(req.body)
    serviceCollection.insertOne(req.body)

  })
  app.get('/orderService/:id', (req, res) => {
    console.log(req.params.id)
    
    serviceCollection.find({ _id: ObjectId(req.params.id) },
    
    
    )
      .toArray((err, documents) => {
        res.send(documents[0])
      })

  }

  )

  app.get('/getService',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  // perform actions on the collection object
 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})