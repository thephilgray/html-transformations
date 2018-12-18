const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const {
  renderComponent,
  renderComponentWithHyperStream
} = require('./index.js');

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const component = `<div><p>Inside the component.</p></div>`;
const fixtures = path.join(__dirname, 'fixtures');
const template = path.join(fixtures, 'test-template.html');
const output = path.join(fixtures, 'output.html');
const expected = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Test</title>
  </head>
  <body>
    <section class="page">
      <h1>title</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
        consequuntur iure fuga quae officiis omnis unde obcaecati, magnam atque
        voluptatem totam quam quasi tempora perferendis optio eaque consectetur
        temporibus delectus.
      </p>
      <div class="test-component">${component}</div>
    </section>
  </body>
</html>`;

beforeEach(async () => {
  // clean output
  try {
    await unlink(output);
  } catch (e) {
    console.error(e);
  }
});

describe('renderComponent', () => {
  test('streams the template to a new file with the component markup inside the selector', async () => {
    try {
      await renderComponent(template, output, component, '.test-component');
    } catch (e) {
      console.error(e);
    }
    expect.assertions(1);

    const data = await readFile(output);
    expect(data.toString()).toMatch(expected);
  });
});

describe('renderComponent with hyperstream', () => {
  test('streams the template to a new file with the component markup inside the selector', async () => {
    try {
      await renderComponentWithHyperStream(
        template,
        output,
        component,
        '.test-component'
      );
    } catch (e) {
      console.error(e);
    }

    expect.assertions(1);
    const data = await readFile(output);
    expect(data.toString()).toMatch(expected);
  });
});
