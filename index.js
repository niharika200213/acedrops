const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv/config');
const path = require('path');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const sellerRoutes = require('./routes/seller');
const prodRoutes = require('./routes/product');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const sequelize = require('./utils/db');

const cart_item = require('./models/cart_item');
const cart = require('./models/cart');
const categories = require('./models/categories');
const fav = require('./models/fav');
const imgUrl = require('./models/imgUrl');
const order_item = require('./models/order_item');
const order = require('./models/order');
const otp = require('./models/otp');
const product = require('./models/product');
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
app.use('/prod',prodRoutes);
app.use('/user',userRoutes);
app.use('/seller',sellerRoutes);
app.use('/admin',adminRoutes);
app.get('/', function (req,res){res.json({name:"niharika"})});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message});
});

shop.hasMany(product,{foreignKey:"shopId",constraints:false,onUpdate:"CASCADE",onDelete:"CASCADE"});
product.belongsTo(shop);

shop.hasMany(imgUrl,{foreignKey:"shopId",constraints:false,onUpdate:"CASCADE",onDelete:"CASCADE"});
imgUrl.belongsTo(shop);
product.hasMany(imgUrl,{foreignKey:"productId",constraints: false,onUpdate:"CASCADE",onDelete:"CASCADE"});
imgUrl.belongsTo(product);

user.belongsToMany(product, {through:fav,constraints: false});
product.belongsToMany(user, {through:fav,constraints: false});

user.belongsToMany(product, {through:reviews,constraints: false});
product.belongsToMany(user, {through:reviews,constraints: false});

user.belongsToMany(product, {through:viewed,constraints: false});
product.belongsToMany(user, {through:viewed,constraints: false});

user.hasOne(cart,{foreignKey:"userId",constraints:false,onUpdate:"CASCADE",onDelete:"CASCADE"});
cart.belongsTo(user);

user.hasMany(order,{foreignKey:"userId",constraints:false,onUpdate:"CASCADE",onDelete:"CASCADE"});
order.belongsTo(user);

order.belongsToMany(product, {through:order_item,constraints: false});
product.belongsToMany(order, {through:order_item,constraints: false});

cart.belongsToMany(product, {through:cart_item,constraints: false});
product.belongsToMany(cart, {through:cart_item,constraints: false});

categories.belongsToMany(product, {through:product_category,constraints: false});
product.belongsToMany(categories,{through:product_category,constraints: false});

user.hasMany(address,{foreignKey:"userId",constraints:false,onUpdate:"CASCADE",onDelete:"CASCADE"});
address.belongsTo(user);

address.hasMany(order,{foreignKey:"addressId",constraints:false,onUpdate:"CASCADE",onDelete:"CASCADE"});
order.belongsTo(address);

sequelize.sync(
  //{force:true}
  )
.then(category=>{app.listen(process.env.PORT||3000); console.log('result');})
.catch(err=>{console.log(err);});