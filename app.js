const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const User = require("./models/user");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");

const session = require("express-session");
const Event = require("./models/event");

const MONGO_URL = "mongodb://127.0.0.1:27017/Event";


const dbUrl= "mongodb+srv://shafin:RTgZFQ94jr1cOsJY@cluster0.rikrzig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
    
}
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");

app.engine("ejs",ejsMate);




const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
  saveUninitialized: true,
  cookie: {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
  



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.listen(port, ()=>{
    console.log("app listening on port 8080");
});

app.get("/",(req,res)=>{
    res.render("index.ejs");
})
app.get("/About",(req,res)=>{
    res.render("About.ejs");
})
app.get("/Contect",(req,res)=>{
    res.render("Contect.ejs");
})
app.get("/signup",(req,res) =>{
    res.render("signup.ejs");
});

app.post("/signup",async(req,res)=>{
    try{
    let {username,email,password} = req.body;
const newUser = new User({email, username});
const registerUser = await User.register(newUser, password);
console.log(registerUser);
req.login(registerUser, (error)=>{
    if(error){
        return next(error);
    }
    
        req.flash("success", "Welcome to WEBSITE");
return res.redirect("/");
    
});
 } catch(error){
        req.flash("error", "User Already Exixts");
        res.redirect("/");
    }
});

app.get("/login",(req,res) =>{
    res.render("login.ejs");
});

app.post("/login",
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async(req,res)=>{
        req.flash("success","Welcome back to WEBSITE");
        let redirectUrl = res.locals.redirectUrl || "/";
        res.redirect("/");
    }
);

app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logout now!");
        res.redirect("/");
    })
});


app.get("/Registration",(req,res) =>{
    res.render("Registration.ejs");
});

app.post("/Event",async(req,res)=>{
    

    const newevent = new Event( req.body.Event);
console.log(newevent);

   newevent.owner = newevent.user;
await newevent.save();
req.flash("success","Successfully Event Add!");
res.redirect("/");

});
app.get("/showEvent",async(req,res) =>{
    const allEvent = await Event.find({});
    res.render("Event.ejs", { allEvent});
});