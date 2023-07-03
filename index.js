// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});

function isUnixTimestamp(value) {
  // Convert the value to a number
  const numericValue = Number(value);

  // Check if the converted value is a valid number
  if (!isNaN(numericValue)) {
    // Check if the value falls within the range of Unix timestamps
    const minValue = 0; // Minimum Unix timestamp
    const maxValue = 2147483648000; // Maximum Unix timestamp in milliseconds (January 19, 2038)

    if (numericValue >= minValue && numericValue <= maxValue) {
      return true;
    }
  }

  return false;
}

function dateToUnix(dateString) {
  const dateParts = dateString.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Months in JavaScript are zero-based
  const day = parseInt(dateParts[2], 10);

  const date = new Date(year, month, day);
  const unixTimestamp = date.getTime(); // Convert milliseconds to seconds

  return unixTimestamp;
}

function isDate(value) {
  const date = new Date(value);

  // Check if the date object is valid
  if (date.toString() === 'Invalid Date') {
    return false;
  }

  // Check if the date value is NaN
  if (isNaN(date.getTime())) {
    return false;
  }
  
  return true;
}

app.get("/api/:data?", (req, res) => {
  var givenDate = req.params.data;

  var error = false;
  var passou = false;
  var strDate = '';
  var utcDate = '';
  var unixDate = 0; 
  var auxDate = null;

  if (givenDate == null) {
    auxDate = new Date();
    // console.log('data agora', auxDate);
  }

  if (auxDate != null) {
      unixDate = auxDate.getTime();
      utcDate = auxDate.toUTCString();
  } else {
    if (!isDate(givenDate)) {
      
      if (!isUnixTimestamp(givenDate)) {
        auxDate = new Date(givenDate);
  
        if(!isDate(auxDate)) {
          error = true;
        }
      } else {
        auxDate = new Date(Number(givenDate));
        
        unixDate = auxDate.getTime(); 
        utcDate = auxDate.toUTCString();
                
        // console.log('unixDate', unixDate);
        // console.log('utcDate', utcDate);
      }
      
    }  else {
      auxDate = new Date(givenDate);
      
      unixDate = auxDate.getTime();
      utcDate = auxDate.toUTCString();
    }  
  }
  

  if (error) {
    res.json({
        error: "Invalid Date"
      });   
  } else {
    res.json({ 
      unix: unixDate,
      utc: utcDate
    });    
  }
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});



