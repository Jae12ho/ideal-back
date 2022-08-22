const makeId = require('./makeID');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 80;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost']}));

app.get('/get', wrap(async (req, res) => {
  console.log(req.query);
  res.json(await makeId.run(req.query));
}))

app.use((err, req, res, next) => {
  // console.log(err);
  res.status(500);
  res.end();
})

function wrap(asyncFn) {
  return async (req, res, next) => {
    try {
      await asyncFn(req, res, next);
    } catch (err) {
      next(err);
    }
  }
}

app.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});