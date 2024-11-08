import express from 'express';
import Listing from  '../models/listings.js'
import Review from '../models/reviews.js';
import customError from '../utils/customError.js';
import wrapAsync from '../utils/wrapAsyncError.js';
import schemaValidations from '../schema.js';


const  router = express.Router({mergeParams: true});
const {listingSchema , reviewSchema} = schemaValidations;


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






router.post("/", reviewValidation ,wrapAsync(async (req,res,next)=>{
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

router.delete("/:reviewId",wrapAsync(async (req,res,next)=>{
    let listingId = req.params.id;
    console.log('listingId: ', listingId);

    let reviewId = req.params.reviewId;
    console.log('reviewId: ', reviewId);

    
    let listing = await Listing.findById(listingId);
    console.log('listing: ', listing);

    // let listDelete = await Listing.deleteOne({ $pull : { reviews :  reviewId  } })
    let listDelete = await Listing.findByIdAndUpdate( listingId , { $pull : { reviews :  reviewId  } })
    console.log('listDelete: ', listDelete);

    let review = await Review.findByIdAndDelete(reviewId);
    console.log('review: ', review);

    res.redirect(`/listings/${listingId}`)

}) )

export default router;