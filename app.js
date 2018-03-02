var fs = require('fs');
var zlib = require('zlib');

var gzip = zlib.createGzip();
var gunzip = zlib.createGunzip();

var writestream1, writestream2, writestream3;
var readstream1, readstream2;

/*
  Make a dummy book
  ~8.1 MB uncompressed
*/
function writeBook() {
  console.log('writing...');

  return new Promise(function(resolve, reject) {
    writestream1 = fs.createWriteStream('./books/book1.txt');
    writestream1.write("Le magnum opus de David\n");
    for(var i = 0; i < 100000; i++) {
      writestream1.write("This is sentence number " + i + ", a truly excellent masterpiece of literary genius. ");

      if(i % 1000 === 0)
        writestream1.write("\n");
    }
    writestream1.write("\n\nfin.");
    writestream1.end();

    writestream1.on('finish', function () {
      console.log("...done writing!\n");
      resolve();
    });
  });
}



/*
  Read dummy book
  then compress and pipe it back out
  ~270 KB compressed
*/
function readAndCompress() {
  console.log('compressing...');

  return new Promise(function(resolve, reject) {
      readstream1 = fs.createReadStream('./books/book1.txt');
      writestream2 = fs.createWriteStream('./books/book1.txt.gz');

      readstream1
        .pipe(gzip)  // compress
        .pipe(writestream2)  // write out
        .on('finish', function () {
          console.log('...done compressing!\n');
          resolve();
        });
    });
}



/*
  Read compressed dummy book
  uncompress and write out to console
  (or to a BRIDGES client!!!?)
*/
function readAndUncompress() {
  console.log('uncompressing...');

  return new Promise(function(resolve, reject) {
      readstream2 = fs.createReadStream('./books/book1.txt.gz');
      writestream3 = fs.createWriteStream('./books/book1copy');
      readstream2
        .pipe(gunzip)  // uncompresses
        .pipe(writestream3); // write to file
        // .pipe(process.stdout);  // write out to console
    });
}

// ok, go
writeBook()
  .then(readAndCompress)
  .then(readAndUncompress);
