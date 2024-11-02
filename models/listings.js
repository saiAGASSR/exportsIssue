import mongoose from "mongoose";
import Review from "./reviews.js";

const Schema  = mongoose.Schema

const listingSchema = new Schema({
    title        : {
        type     : String,
        required : true
    } ,
    description  : String ,
    image        : {
        type     : String,
        default  : "https://media.istockphoto.com/id/598786462/photo/sy-cbd-from-domain-day.jpg?s=1024x1024&w=is&k=20&c=xGdgTy8_vctwwUW_831EJstmq0x7qJaDVIIrYIM64vg=",
        set      : (v) =>  v === "" 
                            ? 
                            "https://media.istockphoto.com/id/598786462/photo/sy-cbd-from-domain-day.jpg?s=1024x1024&w=is&k=20&c=xGdgTy8_vctwwUW_831EJstmq0x7qJaDVIIrYIM64vg="
                            :
                            v
                            
    } ,
    location     : {
        type        : String,
        required    : true
    } ,
    country      :  {
        type        : String,
        required    : true
    } ,
    price        :  {
        type        : Number,
        required    : true
    },
    reviews : [{
        type : Schema.Types.ObjectId ,
        ref : "Review"
    }]
})

const Listing = mongoose.model("Listing", listingSchema);

export default Listing ;