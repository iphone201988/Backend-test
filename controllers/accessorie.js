import { Accessorie } from "../models/accessorie.js";

export async function createAccessorie(req,res) {
     try {
        console.log("1")
        const { accessorieName, accessorieDetail, accessoriePrice } = req.body;
        console.log("2")
        const userId = req.user.id;
        console.log("3")
        let accessorieImage = [];
        if (req.files && req.files.length > 0) {
            accessorieImage = req.files.map((file) => `image/${file.filename}`);
        }
        console.log("4")
        const accessorie = await Accessorie.create({
          accessorieName,
          accessorieDetail,
          accessoriePrice,
          accessorieImage,
          userId,
        });
        console.log("5")
        return res.status(200).json({
          message: "Your Accessorie Created",
          accessorie,
        })
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
}

export async function getAccessorie(req,res) {
    try {
        const userId = req.user.id;
        const accessorie = await Accessorie.find({ userId });
        return res.status(200).json({
          message: "All Accessorie",
          accessorie,
        });
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
}