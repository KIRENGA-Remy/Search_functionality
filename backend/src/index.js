import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

//MONGODB CONNECTION
const connect = mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
    
}).catch((err) => {
    console.log(`An error occured:\n ${err}\n Could not connect to database`);
    
})

// USER SCHEMA
const userSchema = new mongoose.Schema({
    username: String
})
const User = mongoose.model('User', userSchema)

// user creation
app.post('/api/create', async(req, res) => {
    try {
        const username = req.body.username;
        const existingUser = await User.findOne({ username})
        if(existingUser){
            return res.status(400).json({message: "User already exist"})
        }
        const newUser = new User({
            username
        })
        const savedUser = await newUser.save()
        res.status(200).json({ message: "User created", savedUser})
    } catch (err) {
        res.status(500).json({ message: "Failed to create a user"})
        console.log("Error ", err);
        
    }
})

// LOGIC(search API)
app.get('/api/search', async(req, res) => {
    try {
        const { query } = req.query;
        if(!query){
            return res.status(404).json({ error: "Query is required"})
        }
        const users = await User.find({
            username: { $regex: query, $options: 'i'}  // to prevent case-sensitivity eg: john = JOHN
        }).limit(10);
        // Return as object with users array
        res.json({ 
            users: users.map(user => ({
                id: user._id.toString(), 
                username: user.username
            }))
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error'})
        console.log("Error while searching user", err);
        
    }
})

const PORT = process.env.port || 5000

// STARTING SERVER
app.listen(PORT, () => {
    console.log(`App is listening on port http://localhost:${PORT}`);
})