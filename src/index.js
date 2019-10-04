/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const InMemoryWorkshop = require('./domain/inMemoryWorkshop')
const path = require('path')
const ejs = require('ejs')
// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './', 'ui'))
app.use(express.static(path.join(__dirname , './', 'assets/css')))
app.use(bodyParser())

app.get('/', function (req, res) {
    InMemoryWorkshop.getWorkshopList()
    .then(workshops => {
        console.log(workshops, 'init')
        res.render('index', {
            workshops: workshops
        })
    })
})

app.get('/workshop', function (req, res) {
    res.render('workshop')
})

app.post('/workshop', function (req, res) {
    const name = req.body.name
    const description = req.body.description
    InMemoryWorkshop.addWorkshop(name, description).then(() => {
        res.redirect('/')
    })
    .catch(e =>ejs.send(e.message))
})

app.get('/workshop/:name', function (req, res) {
    const workshopName = req.params.name
    InMemoryWorkshop.getWorkshopByName(workshopName)
    .then(workshop => {
        res.render('workshop', workshop)
    })
    .catch(e =>ejs.send(e.message))
})

app.post('/remove-workshop', function (req, res) {
    const initialName = req.body.initialName
    const name = req.body.name
    const description = req.body.description
    InMemoryWorkshop.getWorkshopByName(initialName)
    InMemoryWorkshop.updateWorkshop(initialName, name, description).then(() => {
        res.redirect('/')
    })
    .catch(e =>ejs.send(e.message))
})

app.post('/update-workshop', function(req, res) {
    res.status(500).send('TODO')
})

app.listen(3000, function () {
  console.log('Workshop app listening on port 3000!')
})
