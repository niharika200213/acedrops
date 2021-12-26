const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv/config');
const path = require('path');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const sequelize = require('./utils/db');
const Sequelize = require('sequelize');

const cart_item = require('./models/cart_item');
const cart = require('./models/cart');
const categories = require('./models/categories');
const fav = require('./models/fav');
const imgUrl = require('./models/imgUrl');
const order_item = require('./models/order_item');
const order = require('./models/order');
const otp = require('./models/otp');
const products = require('./models/products');
const reviews = require('./models/reviews');
const shop = require('./models/shop');
const token = require('./models/token');
const user = require('./models/user');
const product_category = require('./models/product_category');
const address = require('./models/address');
const viewed = require('./models/viewed');

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cors({
  origin: "*",
  methods: ['GET','POST','PUT','DELETE', 'PATCH']
}));
app.use('/auth',authRoutes);
app.use('/shop',shopRoutes);
app.get('/', function (req,res){res.json({name:"niharika"})});
app.use(express.static(path.join(__dirname,'images')));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message});
});

shop.hasMany(products);
products.belongsTo(shop);

shop.hasMany(imgUrl);
imgUrl.belongsTo(shop,{constraints:true});
products.hasMany(imgUrl);
imgUrl.belongsTo(products);

user.belongsToMany(products, {through:fav});
products.belongsToMany(user, {through:fav});

user.belongsToMany(products, {through:reviews});
products.belongsToMany(user, {through:reviews});

user.belongsToMany(products, {through:viewed});
products.belongsToMany(user, {through:viewed});

user.hasOne(cart);
cart.belongsTo(user);

user.hasMany(order);
order.belongsTo(user);

order.belongsToMany(products, {through:order_item});
products.belongsToMany(order, {through:order_item});

cart.belongsToMany(products, {through:cart_item});
products.belongsToMany(cart, {through:cart_item});

categories.belongsToMany(products, {through:product_category});
products.belongsToMany(categories,{through:product_category});

user.hasMany(address);
address.belongsTo(user);

order.hasOne(address);

sequelize.sync(
  {force:true}
  )
.then(result=>{app.listen(process.env.PORT||3000); console.log('result');})
.catch(err=>{console.log(err);});