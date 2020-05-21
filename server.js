var express = require('express');
var app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//Require the handlebars express package
var handlebars = require('express-handlebars');
var bcrpyt = require('bcryptjs');
passport = require('passport');
const session = require('express-session');

const { isAuth } = require('./middleware/isAuth');
require('./middleware/passport')(passport);

const Contact = require('./models/Contact');
const User = require('./models/User');


app.use(express.static('public'));
app.use(express.static('assets'));

app.use(
    session({//using express-session
    secret: 'mySecret', // used to create a token similar to bcrpyt- gives individual access to the session
    resave: true,
    saveUnitialized: true,
    cookie: { maxAge: 60000 }
    })
);

app.use(passport.initialize());
app.use(passport.session()); //session handles it post login
// body parser structures the request into a format that's simple to use
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

//use app.set to tell express to use handlebars as our view engine
app.set('view engine', 'hbs');
//Pass some additional information to handlebars to that is can find our layouts folder, and allow
//us to use the .hbs extension for our files.
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs'
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', isAuth, (req, res) => {
//     try {
//     Contact.find({ user: req.user.id }).lean()
//         .exec((err, contacts) => {
//             if (contacts.length) {
//                 res.render('home', { layout: 'main', contacts: contacts, contactsExist: true, username: req.user.username });
//             } else {
//                 res.render('home', { layout: 'main', contacts: contacts, contactsExist: false,});
//             }
//         });
//     } catch (err) {
//         console.log(err.message);
//         res.status(500).send('Server Error')
//     }

// });

app.get('/signout', (req, res)=>{
    req.logout();
    res.redirect('/')
})

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    // better way to handle the task and shows the error relating to it
    try { 
        // await waits on the request to make sure it has everything loaded
        let user = await User.findOne({ username });
        
        if (user) {
            // res.redirect('/');
            return res.status(400).render('login', { layout: 'main', userExist: true });
            // return console.log('User Already Exists');
        }
        user = new User({
            username,
            password
        });
          // salt process generates a random string which attaches it to the encrypted string
          const salt = await bcrpyt.genSalt(10);
          // password encryption using password and salt
          user.password = await bcrpyt.hash(password, salt);

          await user.save();
          res.status(200).render('login', { layout: 'main', userDoesNotExist: true });
          // user.save(); 
          // res.redirect('/create');
      } catch (err) {
          console.log(err.message);
      // gives a code to our error on the web side
          res.status(500).send('Server Error')
      }
  })

app.post('/signin', (req, res, next) => {
    try {
        passport.authenticate('local', {
            successRedirect: '/home',
            failureRedirect: '/?incorrectLogin' // fix this?
        })(req, res, next);
        // if (err) throw err
        // console.log('logged in');
        // res.send('logged in');
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

app.post('/addContact', (req, res) => {
    //users are destructured to extract the name, email and number from the req
    const { name, email, number } = req.body;
    try { 
    let contact = new Contact({
        user: req.user.id, 
        name,
        email,
        number
    });
    
    contact.save();
    res.redirect('/home?contactSaved');//dont work
} catch (err) {
    console.log(err.message);
// gives a code to our error on the web side
    res.status(500).send('Server Error')
}
})


app.get('/', (req, res) => {
    res.render('login', {layout: 'main'});
})
app.get('login', (req, res) => {
    res.render('login', {layout: 'main'});
})
app.get('/signin', (req, res) => {
    res.render('signin', {layout: 'main'});
})

app.get('/signup', (req, res) => {
    res.render('signup', {layout: 'main'});
})

app.get('/create', (req, res) => {
    res.render('create', {layout: 'main'});
})

app.get('/forgottenpass', (req, res) => {
    res.render('forgottenpass', {layout: 'main'});
})

app.get('/help', (req, res) => {
    res.render('help', {layout: 'main'});
})

app.get('/calender', (req, res) => {
    res.render('calender', {layout: 'main'});
})

app.get('/contact', (req, res) => {
    res.render('contact', {layout: 'main'});
})

app.get('/home', (req, res) => {
    res.render('home', {layout: 'main'});
})

app.get('/panic', (req, res) => {
    res.render('panic', {layout: 'main'});
})

app.get('/depression', (req, res) => {
    res.render('depression', {layout: 'main'});
})

app.get('/bipolar', (req, res) => {
    res.render('bipolar', {layout: 'main'});
})

app.get('/eating', (req, res) => {
    res.render('eating', {layout: 'main'});
})

app.get('/anxiety', (req, res) => {
    res.render('anxiety', {layout: 'main'});
})

// app.get('/about', (req, res) => {
//     //use res.render to display our about template, using the main layout
//     res.render('about', { layout: 'main' });
// });
// mongoose.connect('mongodb://localhost:27017/handlebars'
mongoose.connect('mongodb+srv://Smith:passwordfullstack@clusterfullstack-quihk.mongodb.net/contactManager?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => {
        console.log('connected to DB')
    })
    .catch((err) => {
        console.log('Not Connected to DB : ' + err);
    });

//Listening for requests on port 3000
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});