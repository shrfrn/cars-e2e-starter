import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { carService } from './services/car.service.js'
import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:

// REST API for Cars
app.get('/api/car', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSpeed: +req.query.minSpeed || 0,
        maxPrice: +req.query.maxPrice || 0,
        pageIdx: req.query.pageIdx || undefined,
    }
    carService.query(filterBy)
        .then(cars => res.send(cars))
        .catch(err => {
            loggerService.error('Cannot get cars', err)
            res.status(400).send('Cannot get cars')
        })
})

app.get('/api/car/:carId', (req, res) => {
    const { carId } = req.params

    carService.getById(carId)
        .then(car => res.send(car))
        .catch(err => {
            loggerService.error('Cannot get car', err)
            res.status(400).send('Cannot get car')
        })
})

app.post('/api/car', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const car = {
        vendor: req.body.vendor,
        price: +req.body.price,
        speed: +req.body.speed,
    }
    carService.save(car, loggedinUser)
        .then(savedCar => res.send(savedCar))
        .catch(err => {
            loggerService.error('Cannot save car', err)
            res.status(400).send('Cannot save car')
        })
})

app.put('/api/car/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const car = {
        _id: req.params.id,
        vendor: req.body.vendor,
        price: +req.body.price,
        speed: +req.body.speed,
    }
    carService.save(car, loggedinUser)
        .then(savedCar => res.send(savedCar))
        .catch(err => {
            loggerService.error('Cannot save car', err)
            res.status(400).send('Cannot save car')
        })
})

app.delete('/api/car/:carId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove car')

    const { carId } = req.params
    carService.remove(carId, loggedinUser)
        .then(() => res.send('Removed!'))
        .catch(err => {
            loggerService.error('Cannot remove car', err)
            res.status(400).send('Cannot remove car')
        })
})

// User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            loggerService.error('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})



app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

// Auth API
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body

    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


app.put('/api/user', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(400).send('No logged in user')
    const { diff } = req.body
    if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
    loggedinUser.score += diff
    return userService.save(loggedinUser).then(user => {
        const token = userService.getLoginToken(user)
        res.cookie('loginToken', token)
        res.send(user)
    })
})


// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
