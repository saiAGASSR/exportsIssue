import Joi from "joi";


const listingSchema = Joi.object({
    title       : Joi.string().required(),
    description : Joi.string().required().min(10),
    price       : Joi.number().integer().min(1),
    country     : Joi.string().required(),
    location    : Joi.string().required(),
    image       : Joi.allow("",null)
})




const listingSchema2 = Joi.object({
    listing : Joi.object({
        title       : Joi.string().required(),
        description : Joi.string().required().min(10),
        price       : Joi.number().integer().min(1),
        country     : Joi.string().required(),
        location    : Joi.string().required(),
        image       : Joi.allow("",null)
    })
    }).required();

const reviewSchema = Joi.object({
    review : Joi.object({
        comment : Joi.string().required(),
        rating  : Joi.number().min(1).max(5).required()

    }).required()
})


export default {listingSchema , reviewSchema};