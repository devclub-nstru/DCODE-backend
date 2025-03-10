import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userroute.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
})
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
  });

app.use('/api/users', userRoutes);

app.listen(3005, ()=> {
    console.log('Server is running on port 3000');
})