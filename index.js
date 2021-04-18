const express = require('express')

const cors=require('cors')
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port =process.env.PORT||5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqnwo.mongodb.net/cerativeAgency?retryWrites=true&w=majority`;

console.log(uri)


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
  const bookingCollection = client.db("cerativeAgency").collection("booking");
  const adminCollection = client.db("cerativeAgency").collection("admin");
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

  app.delete('/delete/:id', (req, res) => {
    console.log( ObjectId(req.params.id))
    serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => { 
        res.send(result.deletedCount>0)
       })
      
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

  app.post('/serviceBooking',(req,res)=>{
    console.log(req.body)
    bookingCollection.insertOne(req.body)

  })

  app.post('/addAdmin',(req,res)=>{
    console.log(req.body)
    adminCollection.insertOne(req.body)

  })


  app.post('/orderList', (req, res) => {
    
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            const filter = {}
            if (admin.length === 0) {
                filter.email = email;
            }
            bookingCollection.find(filter)
                .toArray((err, documents) => {
                   
                    res.send(documents);
                })
        })
})
  // perform actions on the collection object

  
   
 

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
})
 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})