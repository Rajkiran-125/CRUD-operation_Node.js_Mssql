const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var sql = require("mssql");


// route
app.set('view engine','ejs')

app.get('/index',function(req,res){
    res.render('index');
});

app.get('/form',function(req,res){
    res.render('form');
});




// database connection
var config = {
    user: 'sa',
    password: '12345678',
    server: 'DESKTOP-L30FJ0M\\SQLEXPRESS', 
    database: 'employee',
    port:1433,
      options: {
        trustedConnection: true,
        trustServerCertificate: true
      },
      useNullAsDefault: true
};
        
sql.connect(config, (err) => {
  if (err) {
    console.log('Failed to connect to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});





// index
app.get('/', (req, res) => {
    const request = new sql.Request();
    request.query('SELECT * FROM emp', (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
      } else {
        res.render('index', { data: result.recordset });
      }
    });
  });




// form submit
app.post('/submit-form', (req, res) => {
    const { firstname, lastname, email, salary } = req.body; // Assuming the form has input fields with names 'input1', 'input2', 'input3'
  
    const query = "insert into emp(firstname,lastname,email,salary) values('"+firstname+"','"+lastname+"','"+email+"','"+salary+"' )";
  
    sql.query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
      } else {
        res.redirect("/")
      }
    });
  });




// edit 
app.post('/edit/:id', (req, res) => {

    var id = req.params.id;
    const { firstname, lastname, email, salary } = req.body; // Assuming the form has input fields with names 'input1', 'input2', 'input3'
  
    const query = "update emp set firstname='"+firstname+"', lastname='"+lastname+"', email='"+email+"', salary='"+salary+"' where id = '"+id+"' ";
  
    sql.query(query, (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
      } else {
        res.redirect("/")
      }
    });
});





// update form data

app.get('/update/:id', (req, res) => {

    var id = req.params.id;
    console.log(id)
    const request = new sql.Request();
    request.query("select * from emp where id = '"+id+"'", (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.render('/');
      } else { 
        res.render('update', { data: result.recordset });
      }
    });
});



// delete

app.get('/delete/:id', (req, res) => {

    var id = req.params.id;
    console.log(id)
    const request = new sql.Request();
    request.query("delete from emp where id='"+id+"'", (err, result) => {
      if (err) {
        console.log('Error executing query:', err);
        res.redirect('/');
    } else { 
          res.redirect('/');
      }
    });
});




const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});