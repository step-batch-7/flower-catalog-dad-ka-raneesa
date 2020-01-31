'use strict';

const fs = require('fs');
const TEMPLATE_FOLDER = `${__dirname}/../templates`;

const loadTemplate = function(fileName, propertyBag) {
  const content = fs.readFileSync(`${TEMPLATE_FOLDER}/${fileName}`, 'utf8');
  const replaceKeysWithValues = function(content, key) {
    const pattern = new RegExp(`__${key}__`, 'g');
    return content.replace(pattern, propertyBag[key]);
  };
  const keys = Object.keys(propertyBag);
  const html = keys.reduce(replaceKeysWithValues, content);
  return html;
};

module.exports = { loadTemplate };
