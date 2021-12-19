const mysql = require('mysql');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  region: 'us-east-1',
})

const bucketName = 'gif-2-bucket';

const con = mysql.createConnection({
    host: 'gif-project-db.cavxmh9v9svl.us-east-1.rds.amazonaws.com',
    port : '3306',
    user: 'admin',
    password: 'IctGroep2',
    database: 'gif_db'
});

exports.handler = () => {
    con.connect(function(err) {
        if (err) throw err;
    
        let sql = `SELECT * FROM gifs`;  
       
        con.query(sql, function(err, result) {
          if (err) throw err;
          
          for (var i = 0; i < result.length; i++) {
            let uuid = result[i].uuid;
            let date = new Date(result[i].createdtime);
        
            let differentDays = Math.ceil(Math.abs((new Date()) - date.getTime()) / (1000 * 3600 * 24));
        
            if (differentDays > 1) {
                removeGifFromDatabase(uuid);
            }
          }
        });
      });
}

function removeGifFromDatabase(uuid) {
        let sql_select = `SELECT * FROM gifs WHERE uuid = '${uuid}'`;

        con.query(sql_select, function(err, result) {
            if (err) throw err;

            let params = { Bucket: bucketName, Key: uuid }

            s3.deleteObject(params, function(err, data) {
                if (err) throw err;
            });
        });

        let sql_delete = `DELETE FROM gifs WHERE uuid='${uuid}'`;

        con.query(sql_delete, function(err, result) {
            if (err) throw err;
        });
}