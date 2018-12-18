const fs = require('fs');
const { promisify } = require('util');
const trumpet = require('trumpet');
const tr = trumpet();

const hyperstream = require('hyperstream');

const copyFile = promisify(fs.copyFile);

const renderComponent = (src, dest, component, selector) => {
  return new Promise((resolve, reject) => {
    const ws = tr.select(selector).createWriteStream();
    ws.end(component);
    fs.createReadStream(src)
      .pipe(tr)
      .pipe(fs.createWriteStream(dest));
    resolve();
  });
};

const renderComponentWithHyperStream = (src, dest, component, selector) => {
  return new Promise((resolve, reject) => {
    const hs = hyperstream({
      [selector]: { _html: component }
    });
    const rs = fs
      .createReadStream(src)
      .pipe(hs)
      .pipe(fs.createWriteStream(dest));
    resolve();
  });
};

module.exports = { renderComponent, renderComponentWithHyperStream };
