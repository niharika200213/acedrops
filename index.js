const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv/config');
const path = require('path');
const authRoutes = require('./routes/auth');
const sequelize = require('./utils/db');
const product = require('./models/products');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cors({
  origin: "*",
  methods: ['GET','POST','PUT','DELETE', 'PATCH']
}));
app.use('/auth',authRoutes);
app.get('/', function (req,res){res.json({name:"niharika"})});
app.use(express.static(path.join(__dirname,'images')));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message});
});
sequelize.sync({ force: true })
.then(result=>{app.listen(process.env.PORT||3000); console.log('result');})
.catch(err=>{console.log(err);});