const express = require('express')
const app = express();
const productRoutes = require('./api/routes/product')
const ordersRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://you-ssef_99:azerty123@node-to-do-app-hs0c5.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'))


app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');
      if (req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods', '*')
            return res.status(200).json({ })
      }
      next()
})

mongoose.set('useCreateIndex', true)


app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes)


app.use((req, res, next) => {
      const error = new Error('NOT FOUND')
      error.status = 404;
      next(error);
})

app.use((error, req, res, next) => {
      res.status(error.status || 500);
      res.json({
            error: {
                  message: error.message 
            }
      })
})

module.exports = app;

