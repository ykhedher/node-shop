const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.diskStorage({
      destination: function(req, file, cb){
            cb(null, './uploads')
      },
      filename: function(req, file, cb){
            cb(null, new Date().toISOString()+file.originalname)
      }
})
const upload = multer({storage: storage})


router.get('/', (req, res, next) => {
     Product.find()
     .select('name price _id productImage')
     .exec()
     .then(docs => {
           console.log(docs);
           if (docs.length > 0){
               res.status(200).json(docs)  
           }
           else{
                 res.status(404).json({
                       message:'No entries found'
                 })
           }
           
     })
     .catch(err => {
           console.log(err);
           res.status(500).json({
                 error: err
           })
     })
});

router.post('/',checkAuth, upload.single('productImage'), (req, res, next) => {
      console.log(req.file)
      const product = new Product({
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
      });
      product.save()
      .then(result => {
            console.log(result);
            res.status(201).json({
                  message: 'Handling POST requests to /products',
                  createdProduct: product
            });
      })
      .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
      })
       
      
});

router.get('/:productId', (req, res, next) =>{
      const id = req.params.productId;
      Product.findById(id)
      .select('name price _id productImage')
      .exec()
      .then(result => {
            console.log(result);
            if(result){
                  res.status(200).json(result)
            }
            else{
                  res.status(404).json({message: 'ID IS NOT VALID'})
            }
      })
      .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
      })
      
})

router.patch('/:productId',checkAuth, (req, res, next) => {
      const id = req.params.productId;
      const updateOps = {}
      for (const ops of req.body){
            updateOps[ops.propName] = ops.value
      }
     Product.update({_id: id}, { $set: updateOps})
     .exec()
     .then(result => {
           console.log(result);
           res.status(200).json(result)
     })
     .catch(err => {
           console.log(err);
           res.status(500).json({error: err})
     })
});

router.delete('/:productId',checkAuth, (req, res, next) => {
      const id = req.params.productId 
      Product.remove({_id: id })
      .exec()
      .then(result => {
            res.status(200).json(result)
      })
      .catch(err => {
            console.log(err);
            res.status(500).json({
                  error: err
            })
      })
});
      
module.exports = router;