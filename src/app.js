const express = require('express');
const cors = require('cors');

const routes = require('./routes/routes')
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/das-jalapa', routes);

app.listen(app.get('port'), () => {
    console.log(`Listen and serve on port ${app.get('port')}`);
})
