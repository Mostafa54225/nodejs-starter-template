const cookieParser = require('cookie-parser');
const epxress = require('express');
const connectDB = require('./db/connect');
const notFound = require('./middleware/404');
const errorHandlerMiddleware = require('./middleware/errorHandler');
require('express-async-errors')
require('dotenv').config();

const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const port = process.env.PORT || 5000;


const app = epxress()

app.use(epxress.json())
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandlerMiddleware)




const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI)
        app.listen(port, () => console.log(`Server started on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()