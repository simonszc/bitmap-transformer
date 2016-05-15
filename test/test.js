'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const reader = require('./../lib/reader');

describe('transformer', () => {
  let buffer;
  before((done) => {
    fs.readFile(__dirname + '/../data/non-palette-bitmap.bmp', (err, data) => {
      if (err) {console.log(err)};
      buffer = data;
      done();
    })
  })
  it('should read proper header properties', () => {
    let expected = {
      type: 'BM',
      size: 30054,
      pixelStart: 54,
      colorDepth: 24,
      bytesPerPixel: 3
    };
    let results = reader.headers;
    expect(results).to.eql(expected);
  })
  it('buffer should be the size its header declares', () => {
    let results = reader.headers.size;
    let expected = buffer.length;
    console.log('buffer size: ' + results + 'bytes');
    expect(results).to.eql(expected);
  })
  it('values from the pixels array should match', () => {
    let expected = [buffer.readUInt8(84), buffer.readUInt8(85), buffer.readUInt8(86)];
    let results = [reader.pixels[10].blue, reader.pixels[10].green, reader.pixels[10].red];
    console.log('tenth pixel: ' + results + ' (BGR out of 255)');
    expect(results).to.eql(expected);
  })
  it('red and green values from the transformed pixels array should match', () => {
    let expected = [buffer.readUInt8(85), buffer.readUInt8(86)];
    let results = [reader.transPixels[10].green, reader.transPixels[10].red];
    console.log('transformed tenth pixel: ' + results + ' (GR out of 255)');
    expect(results).to.eql(expected);
  })
  it('blue values from the transformed pixels array should be 0', () => {
    let expected = buffer.readUInt8(84) * 0;
    let results = reader.transPixels[10].blue;
    console.log('transformed tenth pixel: ' + results + '(B out of 255)');
    expect(results).to.equal(expected);
  })
  it('new buffer headers should be the same as the old headers', () => {
    let expected = {
      type: buffer.toString('ascii', 0, 2),
      size: buffer.readUInt32LE(2),
      pixelStart: buffer.readUInt32LE(10),
      colorDepth: buffer.readUInt16LE(28)
    };
    let results = {
      type: reader.transBuffer.toString('ascii', 0, 2),
      size: reader.transBuffer.readUInt32LE(2),
      pixelStart: reader.transBuffer.readUInt32LE(10),
      colorDepth: reader.transBuffer.readUInt16LE(28)
    };
    expect(results.type).to.equal(expected.type);
    expect(results.size).to.equal(expected.size);
    expect(results.pixelStart).to.equal(expected.pixelStart);
    expect(results.colorDepth).to.equal(expected.colorDepth);
  })
  it('red and green values from the transformed buffer should match', () => {
    let expected = {
      green: buffer.readUInt8(85),
      red: buffer.readUInt8(86)
    }
    let results = {
      green: reader.transBuffer.readUInt8(85),
      red: reader.transBuffer.readUInt8(86)
    }
    expect(results.green).to.equal(expected.green);
    expect(results.red).to.equal(expected.red);
  })

  // it('should do a thing', (done) => {
  //   reader((data) => {
  //     console.log(data.slice(55, 56), bits.slice(55,56))
  //     expect(data.slice(55, 56)).to.eql(bits.slice(55, 56));
  //     done();
  //   })
  // })
})
