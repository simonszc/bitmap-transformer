'use strict';
//type:BM, size: 30054, pixelStart: 54, colorDepth: 24, type: Windows BITMAPINFOHEADER

const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter;

const transformer = module.exports = function(cb) {
  let bits;
  let headers = {};
  let headerBits = [];
  let pixels = [];
  let transPixels = [];
  let transBuffer;
  fs.readFile(__dirname + '/data/non-palette-bitmap.bmp', (err, data) => {
    if (err) {console.log(err);}
    bits = data;
    headers.type = data.toString('ascii', 0, 2);
    headers.size = data.readUInt32LE(2);
    headers.pixelStart = data.readUInt32LE(10);
    headers.colorDepth = data.readUInt16LE(28);
    headers.bitsPerPixel = headers.colorDepth / 8;
    debugger;
    for (var n = 0; n < headers.pixelStart; n++) {
       headerBits.push(data.slice(n, n + 1).toString('hex'));
    }
    debugger;
    for (var i = headers.pixelStart; i < headers.size; i += headers.bitsPerPixel) {
      pixels.push({'blue': parseInt(data.slice(i, i + 1).toString('hex'), 16),
                  'green': parseInt(data.slice(i + 1, i + 2).toString('hex'), 16),
                  'red': parseInt(data.slice(i + 2, i + 3).toString('hex'), 16)
                });
    }
    debugger;
    for (var p = 0; p < pixels.length; p++) {
      transPixels.push({'blue': pixels[p].blue * .5,
                        'green': pixels[p].green * 1.2,
                        'red': pixels[p].red * .5
                      });
    }
    debugger;
    let transBuffer = new Buffer(data);
    console.log(transBuffer.length);
    console.log(pixels.length);
    for (var q = 0; q < 9992; q++) {
      transBuffer.writeUIntLE(transPixels[q].blue, headers.pixelStart + q*3, headers.colorDepth);
      transBuffer.writeUIntLE(transPixels[q].green, headers.pixelStart + (3 * q) + 1, headers.colorDepth);
      transBuffer.writeUIntLE(transPixels[q].red, headers.pixelStart + (3 * q) + 2, headers.colorDepth);
    }
    debugger;
    if(cb) {cb(bits);}
  });
};

//transformer((stuff) => {console.log(stuff);});
transformer();
// };

//transformer(function(stuff) {console.log(stuff);});
