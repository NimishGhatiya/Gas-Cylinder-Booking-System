// const Inventory=require('../models/inventory')
// const {User}=require('../models/user')
// const {Company}=require('../models/company')
// const {invent_validate}=require('../validation/inventory_validate')



// //create product by Company Admin
// module.exports.createInventory=async(req,res)=>{

//     try{
//         const{error}=invent_validate(req.body)
//         if(error)return res.status(400).json(error.details[0].message)

//         let user=await User.findOne(req.user)
//         if(!user)return res.status(404).json('company admin token not found')

//         let company=await Company.findById(req.body.company_id)
//         if(!company)return res.status(404).json('company not found')

//         const check=(req.user._id==company.contact_person)
//         if(!check)return res.status(404).json('product not create ....only allow to this company ----by company admin')

//         let product=new Inventory(req.body)
//         const savedProduct=await product.save()
//          res.status(201).json(savedProduct)
//     }catch(error){
//         res.status(500).send(error.message)
//     }
// }



// // module.exports.updateProduct=async(req,res)=>{
// //     try{
// //         const{error}=updateproduct_validate(req.body)
// //         if(error)return res.status(400).json(error.details[0].message)

// //         let product=await User.findOne(req.user)
// //         if(!product)return res.status(404).json('company admin token not found')

// //         let company=await Company.findById(req.body.company_id)
// //         if(!company)return res.status(404).json('company not found')

// //         const check=(req.user._id==company.contact_person)
// //         if(!check)return res.status(404).json('product not update ....only allow to this company ----by company admin')

// //         product=await Product.findByIdAndUpdate(req.body.product_id,{$set:req.body},{new:true})
// //         if(!product)return res.status(404).json('Product not found')

// //         res.status(200).json('Product update successfully')
// //     }catch(error){
// //         res.status(500).send(error.message)
// //     }
// // }



// // module.exports.deleteProduct=async(req,res)=>{
// //         try{


// //             let product=await User.findOne(req.user)
// //             if(!product)return res.status(404).json('company admin token not found')

// //             let company=await Company.findById(req.params.company_id)
// //             if(!company)return res.status(404).json('company not found')

// //             const check=(req.user._id==company.contact_person)
// //             if(!check)return res.status(404).json('product not delete....only allow to this company ----by company admin')

// //           product=await Product.findByIdAndDelete(req.params.product_id)
// //           if(!product)return res.status(404).json('Product not found')

// //         res.status(200).json('product delete successfully')
// //         }catch(error){
// //             res.status(500).json(error.message)
// //         }
// // }



// // //find unique product by id
// // module.exports.FindProduct=async(req,res)=>{
// // try{
// //     let product=await Product.findById(req.params.id).populate('company_id')
// //     if(!product)return res.status(404).json('Product not found')
// //     res.status(200).json(product)
// // }catch(error){
// //     res.status(500).json(error.message)
// // }
// // }

// // //find all product
// // module.exports.FindAllProduct=async(req,res)=>{
// // try{
// //     let product=await Product.find().select('name')
// //     let count=await Product.count()
// //     res.status(200).json({count,product})
// // }catch(error){
// //     res.status(500).json(error.message)
// // }
// // }