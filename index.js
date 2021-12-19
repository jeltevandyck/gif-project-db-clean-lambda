const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'gif-project-db.c08n1cygjwa3.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'ee53157VV',
    database: 'gif_dev'
});

function getGifsFromDB() {
    con.connect(function(err) {
        if (err) throw err;
    
        let sql = `SELECT * FROM gifs`;  
       
        con.query(sql, function(err, result) {
          if (err) throw err;
          
          for (var i = 0; i < result.length; i++) {
            let uuid = result[i].uuid;
            let date = new Date(result[i].createdtime);
        
            let differentDays = Math.ceil(Math.abs((new Date()) - date.getTime()) / (1000 * 3600 * 24));
        
            if (differentDays > 7) {
                removeGifFromDatabase(uuid);
            }
          }
        });
      });
}

function removeGifFromDatabase(uuid) {
        let query = `DELETE FROM gifs WHERE uuid='${uuid}'`;

        con.query(query, function(err, result) {
            if (err) throw err;
        });
}

getGifsFromDB();