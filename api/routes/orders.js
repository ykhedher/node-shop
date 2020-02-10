const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, (req, res, next) => {
      Order.find()
      .select('_id quantity product')
      .populate('product', 'price')
      .exec()
      .then(doc => {
            res.status(200).json({
                  count: doc.length,
                  orders: doc.map(d => {
                        return {
                              _id: d.id,
                              product: d.product,
                              quantity: d.quantity
                        }
                  }),
                  request: {
                        type: 'GET',
                        url: 'localhost:3000/orders'
                  }
            })
            
      })
      .catch(err => {
            console.log(err)
            res.status(500).json({error: err })
      })
})

router.post('/',checkAuth, (req, res, next) => {
      Product.findById(req.body.productId)
            .then(product => {
                  if(!product){
                        return res.status(404).json({
                              message: 'Product Not Found'
                        })
                  }
                  const order = new Order({
                        _id: mongoose.Types.ObjectId(),
                        quantity: req.body.quantity,
                        product: req.body.productId
                  });
                  return order.save()      
            })
            .then(doc => {
                  res.status(201).json({
                        message: 'Order Created',
                        order: doc
                  })
            })
            .catch(err => {
                  res.status(500).json({
                        message: 'Product Not FOUND',
                        error: err
                  })
            })
}) 
router.get('/:orderId', checkAuth, (req, res, next) => {
      Order.findById(req.params.orderId)
      .populate('product')
      .exec()
      .then(order => {
            if(!order){
                  return res.status(404).json({
                        message: 'Not FOUND '
                  })
            }
            res.status(200).json({
                  order: order,
                  request: {
                        type: 'GET',
                        url:'localhost:3000/orders'
                  }
            })
      })
      .catch(err => {
            res.status(500).json({error: err})
      })
})

router.delete('/:orderId',checkAuth, (req, res, next) => {
      const id = req.params.orderId;
      Order.remove({_id: id})
      .exec()
      .then(doc =>{
            res.status(200).json({
                  message: 'Order deleted'
            })
      })
      .catch(err => {
            res.status(500).json({error: err})
      })
})


module.exports = router;