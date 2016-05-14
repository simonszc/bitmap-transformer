'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const transformer = require('./../transformer');

describe('transformer', () => {
  let bits;
  before((done) => {
    fs.readFile(__dirname + '/../data/non-palette-bitmap.bmp', (err, data) => {
      if (err) {console.log(err)};
      bits = data;
      done();
    })
  })
  it('should read non-palette-bitmap', (done) => {
    transformer((data) => {
      expect(data.toString()).to.eql(bits.toString());
      done();
    })
  })
})
