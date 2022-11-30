const app = require("./express/server")
const path = require('path');
let port = 3005;
app.listen(port, function(){
  console.log(`Server started on port ${port}...`);
});