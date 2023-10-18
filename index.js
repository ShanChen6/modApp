require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connect = require('./config/db')
const crawlRoute = require('./routers/crawl.router')
const fileRoute = require('./routers/file')
const categoryRoute = require('./routers/category')
const newsRoute = require('./routers/news')
const modAppRoute = require('./routers/modApp')
const commonRoute = require('./routers/common')
const bodyParser = require('body-parser')
const authRoute = require('./routers/auth')
const uploadRoute = require('./routers/upload')
const versionRoute = require('./routers/version')
const draftRoute = require('./routers/draft')
const commentRoute = require('./routers/comment')
const seoModAppRoute = require('./routers/titleSeo')
const contactRoute = require('./routers/contact')
const teamInfoRoute = require('./routers/teamInfo')
const reportRoute = require('./routers/report')
const requestRoute = require('./routers/request')

const app = express()

app.use('/static', express.static(path.join(__dirname, 'public')))

app.use(
    cors({
        origin: '*',
    })
)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//connect to database
connect()

//router
//app.use('/api')
app.use('/api/v1/crawlApp', crawlRoute)
app.use('/api/v1/common', commonRoute)
app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/news', newsRoute)
app.use('/api/v1/mod-apps', modAppRoute)
app.use('/api/v1/login', authRoute)
app.use('/api/v1/upload', uploadRoute)
app.use('/api/v1/versions', versionRoute)
app.use('/api/v1/drafts', draftRoute)
app.use('/api/v1/comments', commentRoute)
app.use('/api/v1/file', fileRoute)
app.use('/api/v1/seo', seoModAppRoute)
app.use('/api/v1/contact', contactRoute)
app.use('/api/v1/about-us', teamInfoRoute)
app.use('/api/v1/report', reportRoute)
app.use('/api/v1/request', requestRoute)


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    // render the error page
    res.status(err.status || 500)
    res.send(err.message)
})
app.get('/check-healthy', (req, res) => {
    res.send('Back End API Mod')
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Connect success with port ${PORT}`)
})
