// Copied in large part from
// http://www.position-absolute.com/articles/simple-build-script-to-minify-and-concatenate-files-using-node-js/
// https://github.com/posabsolute/small-build-script-with-node
//

var uglyfyJS = require('uglify-js')
  , clientDir = __dirname + '/client'
  , publicDir = __dirname + '/public'
  , depsDir = __dirname + '/deps'
  , prod = process.env.NODE_ENV === 'production';

var FILE_ENCODING = 'utf-8',
EOL = '\n';
var _fs = require('fs');

function uglify(srcPath, distPath) {
  _fs.writeFileSync(distPath, pro.gen_code(ast), FILE_ENCODING);
  console.log(' '+ distPath +' built.');
}

function concat(opts) {
  var fileList = opts.src;
  var distPath = opts.dest;
  var uglify = opts.uglify;
  var out = fileList.map(function(filePath){
    return _fs.readFileSync(filePath, FILE_ENCODING);
  });
  out = out.join(EOL)

  if (uglify) {
    var jsp = uglyfyJS.parser,
        pro = uglyfyJS.uglify,
        ast = jsp.parse(out);

    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);

    _fs.writeFileSync(distPath, pro.gen_code(ast), FILE_ENCODING);
  } else {
    _fs.writeFileSync(distPath, out, FILE_ENCODING);
  }

  console.log(' '+ distPath +' built.');
}

filesArray = [
    depsDir + '/JSON-js/json2.js',
    clientDir + '/util.js',
    depsDir + '/jquery-bbq/jquery.ba-bbq.js',
    depsDir + '/jquery.transform.js/jquery.transform.light.js',
    clientDir + '/client.js',
]

concat({
  src : filesArray,
  dest : publicDir + "/client.js", 
  uglify : prod
});

concat({
  src : [ depsDir + '/headjs/src/load.js' ],
  dest : publicDir + "/load.js" ,
  uglify : prod
});

concat({
  src : [ clientDir + '/style.css' ],
  dest : publicDir + "/style.css" ,
  uglify : false
});
