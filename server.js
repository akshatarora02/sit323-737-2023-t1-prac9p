const express = require('express')
const {json} = require('express')
const res = require('express/lib/response')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded());
const { MongoClient } = require('mongodb');

const uri = "mongodb://admin1:password123@localhost:32000/?authMechanism=DEFAULT";
const client = new MongoClient(uri);
async function read() {
  try {
    await client.connect();
    const db = client.db('admin');
    const collection = db.collection('users');

    // Find all document in the collection
    const documents = await collection.find().toArray();
    console.log(documents);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
async function readOne(identity) {
  try {
    await client.connect();
    const db = client.db('admin');
    const collection = db.collection('users');

    // Find the specific document in the collection
    const specificUser = await collection.findOne({id: identity});
    console.log(specificUser);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
async function insert(user) {
  try {
    await client.connect();
    const db = client.db('admin');
    const collection = db.collection('users');

    // Insert document in the collection
    const insertUser = await collection.insertOne(user);
    console.log(insertUser);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
async function update(identity,updatedUser) {
  try {
    await client.connect();
    const db = client.db('admin');
    const collection = db.collection('users');

    // Update document in the collection
    const updateUser = await collection.replaceOne({id: identity},updatedUser);
    console.log(updateUser);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
async function remove(identity) {
  try {
    await client.connect();
    const db = client.db('admin');
    const collection = db.collection('users');

    // Delete document in the collection
    const deleteUser = await collection.deleteOne({id: identity});
    console.log(deleteUser);
  } finally {
    // Close the database connection when finished or an error occurs
    await client.close();
  }
}
// User Array
let users = [
];

// Landing page
app.get('/',function(req,res){
    res.send('Hello World')

})


// Display all users in JSON format
app.get('/users',function(req,res){
    res.json(users)
    read().catch(console.error);
    
})


//Display users with a specific ID
app.get('/users/:id',function(req,res){
  const userId = parseInt(req.params.id);
    var userFound = false;

    users.forEach((user, index, array) => {
        if (user.id == userId) {
            res.status(200).send(users[index]);
            userFound = true;
        }
    });
    if (userFound == true)
    {
      readOne(userId).catch(console.error);
    }
    if (userFound == false) {
        res.status(400).send("ERROR: User with ID " + userId + " does not exist");
    }
}
)


// Add new users
app.post('/users', (req, res) => {

    if (req.body === undefined) {
      console.log("ERROR: req.body is undefined");
      res.status(400).send("ERROR: req.body is undefined");
    } 
    else {
      userData = JSON.stringify(req.body);
      console.log("Adding new user with data: " + userData);
  
      const newUser = req.body; 
      users.push(newUser);
      insert(newUser).catch(console.error)
      res.status(201).json(newUser); 
    }
    
  }); 


// Update users using ID
app.put('/users/:id', (req, res) => { 

  const userId = parseInt(req.params.id); 
  console.log("Update user with ID: " + req.params.id);

  const updatedUser = req.body; 

  users = users.map(user => user.id === userId ? updatedUser : user); 
  res.status(200).json(updatedUser); 
  update(userId,updatedUser).catch(console.error)
}); 
  

// Delete user using ID
app.delete('/users/:id', (req, res) => { 
  const userId = parseInt(req.params.id);

  users = users.filter(user => user.id !== userId); 
  res.status(204).send(); 
  remove(userId).catch(console.error)
  console.log("User with User ID " + userId +" has been deleted")
}); 
  
// Start web server  
app.listen(port, () => {
    console.log("App running at http://localhost:" + port)
})