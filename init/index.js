import sampleListings from "./data.js";
import Listing from "../models/listings.js";
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


    async function initDB (){
        // await Listing.deleteMany({});
        await Listing.deleteMany();
        await Listing.insertMany(sampleListings);
    }


    initDB();

    