import { Product } from "../models/product.js";

export async function createProduct(req, res) {
  try {
    const { productName, productDetails, productPrice } = req.body;
    const userId = req.user.id;
    let productImage = [];
    if (req.files && req.files.length > 0) {
      productImage = req.files.map((file) => `image/${file.filename}`);
    }
    const product = await Product.create({
      productName,
      productDetails,
      productPrice,
      productImage,
      userId,
    });
    return res.status(200).json({
      message: "Your Product Created",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function getProduct(req, res) {
  try {
    const userId = req.user.id;
    const product = await Product.find({ userId });
    return res.status(200).json({
      message: "All Products",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { productName, productDetails, productPrice } = req.body;
    const userId = req.user.id;

    let updateData = {
      productName,
      productDetails,
      productPrice,
    };
    console.log("sdsds", id);
    if (req.files && req.files.length > 0) {
      updateData.productImage = req.files.map(
        (file) => `image/${file.filename}`
      );
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      updateData,
      { new: true, runValidators: true }
    );
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product Updated",
      product,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteProduct(req,res) {
    try{
        const {id} = req.params
    const userId = req.user.id
    const product = await Product.findOneAndDelete({
        _id: id,
        userId,
      })
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({
        message:"Product Delete"
      })
    }catch(error){
        return res.status(400).json({error:error.message})
    }
}