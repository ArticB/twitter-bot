var PNG = require("pngjs").PNG;
var fs = require("fs");

console.log("Child Process " + process.argv[2] + " executed." );

var r = process.argv[2];
var g = process.argv[3];
var b = process.argv[4];

let createPng = function () {

    var newfile = new PNG({
        width: 320,
        height: 320
    });

    for (var y = 0; y < newfile.height; y++) {
        for (var x = 0; x < newfile.width; x++) {
            var idx = (newfile.width * y + x) << 2;

            var col = x < (newfile.width >> 1) ^ y < (newfile.height >> 1) ? 0xe5 : 0xff;

            newfile.data[idx] = col;
            newfile.data[idx + 1] = col;
            newfile.data[idx + 2] = col;
            newfile.data[idx + 3] = 0xff;
        }
    }

    // newfile.pack()
    //     .pipe(fs.createWriteStream('images/output.png'))
    //     .on('finish', function () {
    //         console.log('Written!');
    //     });

    return new Promise(function (resolve, reject) {
        resolve(newfile);
    });
}

let putpixel = function (newfile, r, g, b) {



    // fs.createReadStream('output.png')
    //     .pipe(new PNG({
    //         filterType: 4
    //     }))
    //     .on('parsed', function () {

    for (var y = 0; y < newfile.height; y++) {
        for (var x = 0; x < newfile.width; x++) {
            var idx = (newfile.width * y + x) << 2;


            newfile.data[idx] = r;
            newfile.data[idx + 1] = g;
            newfile.data[idx + 2] = b;
            newfile.data[idx + 3] = 255;
        }
    }

    newfile.pack().pipe(fs.createWriteStream('images/output.png'));
    console.log('colored');
    // });
    return new Promise(function (resolve, reject) {
        resolve();
    });
}

createPng().then((newfile) => {
    return putpixel(newfile, r, g, b);
}).then(() => {
    console.log("alldone");
})