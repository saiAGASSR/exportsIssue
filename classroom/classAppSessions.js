import express from 'express';
import session from 'express-session';

const app  = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

// https://www.npmjs.com/package/express-session
app.get("/",(req,res)=>{
    res.send("Home");
})


app.listen("3000" , (req,res)=>{
    console.log("app is listening on port 3000");
    
})