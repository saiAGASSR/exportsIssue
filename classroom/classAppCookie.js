import express from 'express';
import cookieParser from 'cookie-parser';

const app  = express();

app.use(cookieParser("secretcode"));

// https://expressjs.com/en/5x/api.html#res.cookie

app.get("/",(req,res)=>{
    res.send("Home");
})

app.get("/setCookie",(req,res)=>{
    res.cookie('sai','raj');
    res.cookie('anji','suma');
    res.send("cookie is set ")
})

app.get("/setSignedCookie",(req,res)=>{
    res.cookie('saiiiiii','raj' ,{signed: true});
    res.cookie('anjiiiiii','suma');
    res.send("cookie is set ")
})

app.get("/accessCookie",(req,res)=>{
    let {sai = "defaultname if no cookie is present"} = req.cookies;
    let {anji = "defaultname if no cookie is present"} = req.cookies;
    res.send(`the cooke sai value is  ${sai}  <br>  the cooke anji value is  ${anji} <br>    if no cookie is present its defailt value is set   `)
})

app.get("/accessSignedCookie",(req,res)=>{
    console.log(req.cookies);
    console.log(req.signedCookies);
    
    // let {saiiiiii = "defaultname if no cookie is present"} = req.cookies;
    let {saiiiiii = "defaultname if no cookie is present"} = req.signedCookies;
    let {anjiiiiii = "defaultname if no cookie is present"} = req.cookies;
    // let {anjiiiiii = "defaultname if no cookie is present"} = req.signedCookies;
    res.send(`the cooke sai value is  ${saiiiiii}  <br>  the cooke anji value is  ${anjiiiiii} <br>    if no cookie is present its defailt value is set   `)
})

app.listen("3000" , (req,res)=>{
    console.log("app is listening on port 3000");
    
})