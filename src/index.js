/* eslint-disable no-undef */
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const InMemoryWorkshop = require('./domain/inMemoryWorkshop')
const path = require('path')
const ejs = require('ejs')
// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'ui'))
app.use(express.static(path.join(__dirname , 'assets', 'css')))
app.use(bodyParser())

app.get('/', function (req, res) {
    InMemoryWorkshop.getWorkshopList()
      .then(workshops => {
          res.render('index', {
              workshops: workshops
          })
      })
})

app.get('/workshop', function (req, res) {
    res.render('workshop')
})

app.post('/workshop', async function (req, res) {
    const name = req.body.name
    const description = req.body.description
    
    // Check if exists
    try {
        const workshop = await InMemoryWorkshop.getWorkshopByName(name)
        if(typeof workshop !== "undefined" && workshop !== null) {
            throw new Error("Workshop '" + name + "' already exists.");
        }
        InMemoryWorkshop.addWorkshop(name, description)
          .then(() => {
              res.redirect('/')
          })
          .catch(
            e => {
                throw e
            }
          )
    } catch (e) {
        console.error(e.message)
        res.render('workshop', {
            error: true
        })
    }
})

app.get('/workshop/:name', function (req, res) {
    const workshopName = req.params.name
    InMemoryWorkshop.getWorkshopByName(workshopName).then(workshop => {
        if(typeof workshop === 'undefined' || workshop == null) {
            throw new Error("Workshop '" + workshopName + "' not found.");
        }
        res.render('update', {
            workshop: workshop
        })
    })
      .catch(
        e => {
            console.error(e.message)
            res.redirect('/')
        }
      )
})

app.post('/update-workshop', async function (req, res) {
    const initialName = req.body.initialName
    const name = req.body.name
    const description = req.body.description
    let initialWorkshop = {}
    // Check if exists
    try {
        const workshop = await InMemoryWorkshop.getWorkshopByName(name)
        initialWorkshop =  (name === initialName) ? workshop : await InMemoryWorkshop.getWorkshopByName(initialName)
        if(initialName !== name && typeof workshop !== "undefined" && workshop !== null) {
            throw new Error("Workshop '" + name + "' already exists.");
        } else if (typeof initialWorkshop === "undefined" || initialWorkshop === null ) {
            throw new Error("Workshop '" + initialName + "' not found.");
        }
        InMemoryWorkshop.updateWorkshop(initialName, name, description).then(() => {
            res.redirect('/')
        })
          .catch(
            e => {
                throw e
            }
          )
    } catch (e) {
        console.error(e.message)
        res.render('update', {
            workshop: initialWorkshop,
            error: true
        })
    }
})

app.get('/remove-workshop/:name', function(req, res) {
    const workshopName = req.params.name
    InMemoryWorkshop.removeWorkshopByName(workshopName).then(() => {
        res.redirect('/')
    })
      .catch(
        e => {
            console.error(e.message)
            res.redirect('/')
        }
      )
})

app.listen(3000, function () {
    console.log('Workshop app listening on port 3000!')
})
