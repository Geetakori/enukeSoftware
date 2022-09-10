const path = require("path");

var utility = {};
utility.randomString = (length) => {
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};

utility.fileupload = async (files) => {
  return new Promise(async (resolve, reject) => {
      let listKeys = Object.keys(files);
      var currentPath = process.cwd();
      var file_path = path.join(currentPath, '/public/images');
      var filedata = files[listKeys[0]].mv(file_path + '/'+ files[listKeys[0]].name, (error, data) => {
          if (error) {
              reject(null);
          } else {
              resolve(files[listKeys[0]].name);
          }
      })
  })
}

module.exports = utility;
