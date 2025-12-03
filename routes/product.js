import express from "express"
import { upload } from "../middleware/multer.js"
import { createProduct,deleteProduct,getProduct, updateProduct } from "../controllers/product.js"
import { authorization } from "../middleware/authorization.js"

const productRouter=express.Router()

productRouter.post('/createProduct',upload.array("images",5),authorization,createProduct)
productRouter.get('/getProduct',authorization,getProduct)

productRouter.put('/updateProduct/:id',upload.array("images",5),authorization,updateProduct)

productRouter.delete('/deleteProduct/:id',authorization,deleteProduct)

export default productRouter
