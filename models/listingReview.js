import Listing from "./listings.js";
import Review from "./reviews.js";
import mongoose from 'mongoose';



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

const addListingWithReviews = async () => {
    try {
        const review1 = new Review({
            comment: "Amazing place, had a wonderful time!",
            rating: 5
        });
        
        const review2 = new Review({
            comment: "Decent experience, but could have been cleaner.",
            rating: 3
        });
        
        const review3 = new Review({
            comment: "Great value for the price, highly recommend!",
            rating: 4
        });
        
        const review4 = new Review({
            comment: "Not worth the money. Disappointing experience.",
            rating: 2
        });
        
        const review5 = new Review({
            comment: "Loved it! The location is perfect, and the staff is friendly.",
            rating: 5
        });

        let listing_id = "6710da61dc9bb414ca3e0790";

        await review1.save();
        await review2.save();
        await review3.save();
        await review4.save();
        await review5.save();
        
        let result = await Listing.findById(listing_id);
        console.log("Listing found?", !!result);

        if (result) {
            // Add reviews to the listing
            result.reviews.push(review1, review2, review3, review4, review5);
            await result.save();
            console.log("Reviews added to the listing successfully!");
        } else {
            console.log(`No listing with id ${listing_id} found`);
        }

    } catch (error) {
        console.error("Error adding reviews to listing:", error);
    }
};

addListingWithReviews();
