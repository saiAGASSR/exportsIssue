const wrapAsync = (fnc) => {
    return function(req,res,next){
        fnc(req,res,next).catch(err=> next(err))
    }
}

export default wrapAsync;