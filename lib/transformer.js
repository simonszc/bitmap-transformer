"use strict";

const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter;
module.exports = exports = {};
debugger;

const transformer = module.exports = function(cb) {
  let buffer;
  let headers = {};
  let pixels = [];
  let transPixels = [];
  fs.readFile(__dirname + '/../data/non-palette-bitmap.bmp', (err, data) => {
    if (err) {console.log(err);}
    module.exports.buffer = data;
    headers.type = data.toString('ascii', 0, 2);
    headers.size = data.readUInt32LE(2);
    headers.pixelStart = data.readUInt32LE(10);
    headers.colorDepth = data.readUInt16LE(28);
    headers.bytesPerPixel = headers.colorDepth / 8;
    module.exports.headers = headers;
    for (var i = headers.pixelStart; i < headers.size; i += headers.bytesPerPixel) {
      pixels.push({'blue': data.readUInt8(i),
                  'green': data.readUInt8(i + 1),
                  'red': data.readUInt8(i + 2)
                });
    }
    module.exports.pixels = pixels;
    for (var p = 0; p < pixels.length; p++) {
      transPixels.push({'blue': pixels[p].blue * 0,
                        'green': pixels[p].green,
                        'red': pixels[p].red
                      });
    }
    module.exports.transPixels = transPixels;
    let transBuffer = new Buffer(data);
    for (var n = 0; n < transPixels.length; n++) {
      transBuffer.writeUInt8(transPixels[n].blue, headers.pixelStart + headers.bytesPerPixel * n);
      transBuffer.writeUInt8(transPixels[n].green, headers.pixelStart + headers.bytesPerPixel * n + 1);
      transBuffer.writeUInt8(transPixels[n].red, headers.pixelStart + headers.bytesPerPixel * n + 2);
    }
    module.exports.transBuffer = transBuffer;
    fs.writeFile(__dirname + '/../data/transformed-bitmap.bmp', transBuffer, (err) => {
      if(err) throw err;
      console.log('saved!');
    })
    if(cb) {cb(buffer);}
  });
}

transformer();