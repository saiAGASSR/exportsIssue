import express from 'express';
import Listing from  '../models/listings.js'
import Review from '../models/reviews.js';
import customError from '../utils/customError.js';
import wrapAsync from '../utils/wrapAsyncError.js';
import schemaValidations from '../schema.js';

const  router = express.Router();
const {listingSchema , reviewSchema} = schemaValidations;



const listingValidation = (req,res,next) => {
    // let validationResult  = listingSchema.validate(req.body);
    let {error} =  listingSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map(el=>el.message).join(",");
        throw new customError(400,errorMsg);
    }else{
        next();
    }
}


router.get("/", wrapAsync(async (req,res,next)=>{

    let allListings = await Listing.find({})
    console.log("req reciedved");
    
    res.render("./listings/allListings",{allListings})

}));

router.get("/new", wrapAsync(async(req,res)=>{
res.render("./listings/addListForm")
}));

router.get("/:id", wrapAsync(async (req,res)=>{
let  id     = req.params.id ;
console.log(id);

let  singleListing  =  await Listing.findById(id).populate("reviews");
console.log(singleListing);

res.render('listings/singleListing' , {singleListing})
}));



// Validating  listing form using joi 
router.post("/", listingValidation ,wrapAsync(async (req, res, next) => {
console.log("new post request ");
console.log(req.body);
// Create a new listing object
let addList = new Listing({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    country: req.body.country,
    location: req.body.location
});

await addList.save();
res.redirect("/listings"); // Redirect after successful save

console.log("added");
}));



router.get("/edit/:id",wrapAsync(async(req,res)=>{
console.log(req.params.id);
let id = req.params.id;
let editListing = await Listing.findById(id);
res.render("./listings/editListForm",{editListing})

}));

router.put("/edit/:id",wrapAsync(async(req,res)=>{
let id = req.params.id;
if(!req.body.listing){
    throw new customError(400,"please provide information")
} 
let updateJSONBody = req.body.listing;
let editListing = await Listing.findByIdAndUpdate(id,{...updateJSONBody})

console.log('id in put is ',id);
console.log('body in put is ',updateJSONBody);
res.redirect(`/listings/${id}`)

}));

router.delete("/delete/:id", wrapAsync(async(req,res)=>{
let id = req.params.id;
await Listing.findByIdAndDelete(id)
res.redirect("/listings");
}));

router.delete("/" ,wrapAsync(async(req,res)=>{
    await Listing.deleteMany({});
    res.redirect("/listings");
}));


export default router;


// router.post("/listings", wrapAsync(async(req,res,next)=>{
//     // try {
//             console.log("new post request ");
//             console.log(req.body);
//             let requiredFields = ["title","description","price","image","country","location"];
//             let missingFields = [];
//             for(field in req.body){
//                 if(!(field  in requiredFields) ){
//                     missingFields.push(field)
//                 }
//             }

//             let addList = new Listing({
//                 title : req.body.title,
//                 description : req.body.description,
//                 price : req.body.price,
//                 image : req.body.image,
//                 country : req.body.country,
//                 location : req.body.location
//             });


//             if(!addList.title){
//                 throw new customError(404,"please provide title")
//             }
//             if(!addList.description){
//                 throw new customError(404,"please provide description")
//             }
//             if(!addList.price){
//                 console.log("price is there?", addList.price);
            
//                 throw new customError(404,"please provide price")
//             }else if(isNaN(addList.price)){
//                 throw new customError(404,"please provide price in numeric values")

//             }
//             if(!addList.country){
//                 throw new customError(404,"please provide country")
//             }
//             if(!addList.location){
//                 throw new customError(404,"please provide location")
//             }

        

//            await addList.save();
//         //    res.send("added");

//            res.redirect("/listings"); // Redirect after successful save

//            console.log("added");
       

//     //     } 
//     // catch (err) 
//     //     {
//     //         console.log("error catched");
//     //         res.status(500).send("An error occurred while adding the listing."); // Send an error response

//     //         next(err)
//     //     }

// }));

// chatGPT code

// router.post("/listings", wrapAsync(async (req, res, next) => {
//     console.log("new post request ");
//     console.log(req.body);

//     // Required fields
//     let requiredFields = ["title", "description", "price", "image", "country", "location"];
//     let missingFields = [];

//     // Check for missing required fields
//     requiredFields.forEach(field => {
//         if (!req.body[field]) {
//             missingFields.push(field);
//         }
//     });

//     // If any required fields are missing, throw an error
//     if (missingFields.length > 0) {
//         throw new customError(404, `Please provide the following fields: ${missingFields.join(", ")}`);
//     }

//     // Create a new listing object
//     let addList = new Listing({
//         title: req.body.title,
//         description: req.body.description,
//         price: req.body.price,
//         image: req.body.image,
//         country: req.body.country,
//         location: req.body.location
//     });

//     // Check if price is numeric
//     if (isNaN(addList.price)) {
//         throw new customError(404, "Please provide price in numeric values");
//     }

//     // Save the listing
//     await addList.save();
//     res.redirect("/listings"); // Redirect after successful save

//     console.log("added");
// }));


