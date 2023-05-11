const asyncHandler = require("../services/asyncHandler");
const { default: CustomError } = require("../utils/customError");
const Collection = require ("../models/collectionSchema")

exports.createCollection = asyncHandler(async(req,res)=>{
    const {name} = req.body
    if(!name){
        throw new CustomError('Please enter collection name' , 400);
    }

        const collection = await Collection.create({
            name
        })

        res.status(200).json({
            success:true,
            message:'Collection created successfully'
        })
})


exports.updateCollection = asyncHandler(async(req,res)=>{
    const {id:collectionId} = req.params
     const {name} = req.body
   let updatedCollection =  await Collection.findByIdAndUpdate(collectionId,{
    name
   },
   {
    new:true,
    runValdators:true
   });

   if(!updatedCollection){
    throw new CustomError('collection not found' , 400)
   }

   res.status(200).json({
    success:true,
    message:"collection updated successfully",
    updatedCollection
   })
})


exports.deleteCollection= asyncHandler(async(req,res)=>{
    const{id:collectionId} =req.params
   const collectionDelete =  await Collection.findByIdAndDelete(collectionId)
   if(!collectionDelete){
    throw new CustomError("collection does not exits" , 400);
   }

   collectionDelete.remove();
   res.status(200).json({
    success:true,
    message:'collection deleted successfully',
   });
})

exports.getAllCollections = asyncHandler(async(req,res)=>{
    const collection = await Collection.find()
    if(!collection){
        throw new CustomError("no collection found " , 400)
    }
    res.status(200).jon({
        success:true,
        collection
    })
})