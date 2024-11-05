import express from 'express';
import mongoose from 'mongoose';
import Listing from  './models/listings.js'
import Review from './models/reviews.js';
import path   from "path";
import {dirname}   from "path";
import { fileURLToPath } from "url";
import { log } from 'console';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import customError from './utils/customError.js';
import wrapAsync from './utils/wrapAsyncError.js';
import schemaValidations from './schema.js';
const {listingSchema , reviewSchema} = schemaValidations;



const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);


const app = express();

app.use(express.urlencoded({extended: true}));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride('_method'));

app.engine('ejs',ejsMate)

app.listen(8080, ()=>{
    console.log(`app is listening on port number 8080`);
    
})

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"

async function main (){
    await  mongoose.connect(mongo_url)
}

main()
    .then(()=>{
        console.log("connected to db successfully ");
        
    })
    .catch((err)=>{
        console.log(err);
        
    })


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

const reviewValidation = (req,res,next) => {
    console.log("post request received");
    
    console.log(req.body);
    
    // let validationResult  = listingSchema.validate(req.body);
    let {error} =  reviewSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map(el=>el.message).join(",");
        throw new customError(400,errorMsg);
    }else{
        next();
    }
}


app.get("/",wrapAsync(async(req,res)=>{
    res.send("working ");
}));

app.get("/testListing", wrapAsync(async(req,res)=>{
    let sampleListing = new Listing({
        title       : "My Dream Bike mt-07",
        description : "I love this bike",
        image       : "",
        // image : "https://imgd.aeplcdn.com/1280x720/n/cw/ec/146941/mt-07-right-front-three-quarter.jpeg?isig=0",
        location    : "hyderabad",
        country     : "INDIA",
        price       : 1500000
    })
    await sampleListing.save();
    console.log("saved");
    res.send("saved")
    
}));

app.get("/listings", wrapAsync(async (req,res,next)=>{

        let allListings = await Listing.find({})
        console.log("req reciedved");
        
        res.render("listings/allListings",{allListings})

}));

app.get("/listings/new", wrapAsync(async(req,res)=>{
    res.render("listings/addListForm")
}));

app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let  id     = req.params.id ;
    console.log(id);
    
    let  singleListing  =  await Listing.findById(id).populate("reviews");
    console.log(singleListing);
    
    res.render('listings/singleListing' , {singleListing})
}));

// app.post("/listings", wrapAsync(async(req,res,next)=>{
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

// app.post("/listings", wrapAsync(async (req, res, next) => {
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



// Validating  listing form using joi 
app.post("/listings", listingValidation ,wrapAsync(async (req, res, next) => {
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



app.get("/listing/edit/:id",wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    let id = req.params.id;
    let editListing = await Listing.findById(id);
    res.render("listings/editListForm",{editListing})
    
}));

app.put("/listing/edit/:id",wrapAsync(async(req,res)=>{
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

app.delete("/listing/delete/:id", wrapAsync(async(req,res)=>{
    let id = req.params.id;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");
}));

app.delete("/listings" ,wrapAsync(async(req,res)=>{
        await Listing.deleteMany({});
        res.redirect("/listings");
}));

app.post("/listing/:id/review", reviewValidation ,wrapAsync(async (req,res,next)=>{
        let listingId = req.params.id;
        console.log('listingId: ', listingId);


        let newReview = new Review(req.body.review);
        console.log('newReview: ', newReview);
        let listing = await Listing.findById(listingId);

        console.log('listing: ', listing);

        listing.reviews.push(newReview);
        await newReview.save(),
        await listing.save();


        res.redirect(`/listings/${listingId}`)

}) )

app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async (req,res,next)=>{
    let listingId = req.params.id;
    console.log('listingId: ', listingId);

    let reviewId = req.params.reviewId;
    console.log('reviewId: ', reviewId);

    
    let listing = await Listing.findById(listingId);
    console.log('listing: ', listing);

    // let listDelete = await Listing.deleteOne({ $pull : { reviews :  reviewId  } })
    let listDelete = await Listing.findByIdAndUpdate( listingId , { $pull : { reviews :  reviewId  } })
    console.log('listDelete: ', listDelete);

    let review = await Review.findById(reviewId);
    console.log('review: ', review);

    res.redirect(`/listings/${listingId}`)

}) )


app.all("*",(req,res,next)=>{
    next (new customError(404,"Page not found "))
})

// app.use((err,req,res,next)=>{
//     next( new customError(500,err.message) )
// })

app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode = 500 , message = "something went wrong "} = err;
    res.status(statusCode).render("listings/error.ejs" , {err})
    // res.status(statusCode).send(message);
})