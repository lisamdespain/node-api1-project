// BUILD YOUR SERVER HERE
const express = require('express');
const server = express();
const Users = require('./users/model');

server.use(express.json());
// Get: returns an array of users
server.get('/api/users', (req, res) =>{
    Users.find().then(result=>{
        res.json(result);
    }).catch(err =>{
        err.status(500).json({ message: 'The users information could not be retrieved'})
    })
})
// Get: returns a user with specified id
server.get('/api/users/:id', (req, res) =>{
    Users.findById(req.params.id).then(result =>{
        if(result == null){
            res.status(404).json({ message: 'The user with the specified ID does not exist' });
            return;
        }
        res.json(result);
    }).catch(err =>{
        err.status(500).json({ message: 'The user information could not be retrieved'})
    })
})
// Post: Creates a user with info from the body
server.post('/api/users', (req, res) =>{
    if (!req.body.name || !req.body.bio){
        res.status(400).json({ message: 'Please provide name and bio for the user' });
        } else {
            Users.insert(req.body).then(newUser =>{
                res.status(201).json(newUser)
            }) .catch(err =>{
        err.status(500).json({ message: 'There was an error while saving the user to the database'})
            })}
    })
    
// Put: updates a user with specified id with info from the body, returns the user.
server.put('/api/users/:id', async (req, res)=>{
    const user = await Users.findById(req.params.id)
    const { name, bio } = req.body;
    if (name == null || bio == null){
        res.status(400).json({message: 'Please provide name and bio for the user'})
    } else if (!user) {
        res.status(404).json({ message: 'The user with the specified ID does not exist' });
    } else {
    Users.update(req.params.id, req.body)
    .then(user => {
        res.status(200).json(user);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'The user information could not be modified' });
      });
  }});
// Delete: deletes a user with the specified id and returns the user
server.delete('/api/users/:id', (req, res) =>{
    Users.remove(req.params.id).then(result =>{
        if(result == null){
            res.status(404).json({ message: 'The user with the specified ID does not exist' });
            return;
        }
        res.json(result);
    }).catch(err =>{
        err.status(500).json({ message: 'The user information could not be retrieved'})
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
