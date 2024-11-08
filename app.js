import express from 'express';
import mongoose from 'mongoose';
import path   from "path";
import {dirname}   from "path";
import { fileURLToPath } from "url";
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import customError from './utils/customError.js';
import listings from './routes/listings.js';
import reviews from './routes/reviews.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

const app = express(); 

app.use(express.urlencoded({extended: true}));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride('_method'));



app.use("/listings",listings);
app.use("/listing/:id/reviews",reviews);

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




    // app.get("/",wrapAsync(async(req,res)=>{
    //     res.send("working ");
    // }));
    
    // app.get("/testListing", wrapAsync(async(req,res)=>{
    //     let sampleListing = new Listing({
    //         title       : "My Dream Bike mt-07",
    //         description : "I love this bike",
    //         image       : "",
    //         // image : "https://imgd.aeplcdn.com/1280x720/n/cw/ec/146941/mt-07-right-front-three-quarter.jpeg?isig=0",
    //         location    : "hyderabad",
    //         country     : "INDIA",
    //         price       : 1500000
    //     })
    //     await sampleListing.save();
    //     console.log("saved");
    //     res.send("saved")
        
    // }));


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