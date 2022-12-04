const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./utils/errors');
const cookieParser = require('cookie-parser');
const cors = require('cors')

// INIT
const app = express();
app.use(express.json());
dotenv.config({ path: './.env' });

app.enable('trust proxy')
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://mogpainting.com'],
//   credentials: true
// }))
// //app.options('*', cors())
// app.use(function (req, res, next) {
//   // res.setHeader('Access-Control-Allow-Origin', 'https://www.raniadev.com');
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'X-HTTP-Method-Override', 'X-Requested-With');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

var whitelist = ['http://localhost:3000', 'http://127.0.0.1:5500', 'https://mog-dash.vercel.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions ))
 
// DB
const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));




app.use(express.json({ limit : '10kb' }));
app.use(cookieParser());



// ROUTES
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);


// ERROR MIDDLEWARE
app.use(errorMiddleware);

// RUN THE SERVER
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server running on ${port}.....`))

process.on('SIGTERM', () => {
  console.log('SIGTERM recieved');
  server.close(() => {
    console.log('Process terminated')
  })
})

module.exports = app;