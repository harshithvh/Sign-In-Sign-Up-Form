const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const alert = require("alert")
const Register = require('./models/schema')

const app = express()

app.use(express.static(path.join(__dirname, 'views')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

// connect to mongoDB
const dbURI = 'URL'
 
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
      console.log('Connected to Database')
      app.listen(3000, () => console.log('Server running on port 3000'))
   }) 
   .catch((err) => console.log(err))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

//app.get('/register', (req, res) => {
//    res.render('register.ejs')
//})

app.post('/register', async (req, res) => {
    const password = req.body.password
    const confirmpassword = req.body.confirmpassword

    if(password === confirmpassword) {
        const registerUser = new Register({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword
        })
        try{
            await registerUser.save()
            res.redirect('/registered')
        } catch (err) {
            res.send(err)
        }
    } else {
        res.send('Password are not matching')
    }
})

app.post('/login', async (req, res) => {

    // Check if the email exists
    const user = await Register.findOne({ username: req.body.username })

    if (!user) return res.status(400).send('Username is not found')

    // Check if password is correct
    const validPass = await Register.findOne({ password: req.body.password })
    if (!validPass) return res.status(400).send('Invalid password')

    res.render('dashboard.ejs', {user: req.body.username})
})

app.get('/registered', (req, res) => {
    res.render('index.ejs')
    alert('Registered Successfully!')
})

app.get('/logout', (req, res) => {
    res.render('index.ejs')
})
