let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http').Server(app);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('pug', require('pug').__express)
app.set('views', '.')
app.set('view engine', 'pug')

app.get('/', function(req, res) {
  res.sendFile('/index.html', { root: '.' });
});

app.get('/create', function(req, res) {
  res.sendFile('/create.html', { root: '.' });
});
app.post('/create', function (req, res, next) {
  
    const customers = client.db("crmdb").collection("customers");

    let customer = {name: req.body.name, address: req.body.address,     telephone: req.body.telephone, note: req.body.note};
    customers.insertOne(customer);
    
  
  res.send('Customer created');
})
app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
  console.log('listening on port', app.get('port'));
});
app.get('/get', function (req, res) {
  res.sendFile('/get.html', {root: '.'});
});

app.get('/get-client', function (req, res) {
    client.connect(err => {
        client.db("crmdb").collection("customers").findOne({name: req.query.name}, function(err, result) {
          if (err) throw err;
          res.render('update', {oldname: result.name, oldaddress: result.address, oldtelephone: result.telephone, oldnote: result.note, name: result.name, address: result.address, telephone: result.telephone, note: result.note});
        });
      });
});
app.post('/update', function(req, res) {
  client.connect(err => {
    if (err) throw err;
    let query = { name: req.body.oldname, address: req.body.oldaddress, telephone: req.body.oldtelephone, note: req.body.oldnote };
    let newvalues = { $set: {name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note } };
    client.db("crmdb").collection("customers").updateOne(query, newvalues, function(err, result) {
        if (err) throw err;
        console.log("1 document updated");
        res.render('update', {message: 'Customer updated!', oldname: req.body.name, oldaddress: req.body.address, oldtelephone: req.body.telephone, oldnote: req.body.note, name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note});
      });
  });
})

app.post('/delete', function(req, res) {
  client.connect(err => {
    if (err) throw err;
    let query = { name: req.body.name, address: req.body.address ? req.body.address : null, telephone: req.body.telephone ? req.body.telephone : null, note: req.body.note ? req.body.note : null };
    client.db("crmdb").collection("customers").deleteOne(query, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      res.send(`Customer ${req.body.name} deleted`);
    });
  });
})

const MongoClient = require('mongodb').MongoClient;
const mongo_username = process.env['new123']
const mongo_password = process.env['new123']

const uri = `mongodb+srv://new123:new123@cluster0.pz28f7c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
