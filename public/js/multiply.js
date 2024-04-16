import Handlebars from 'handlebars';

export function registerMultiplyHelper() {
  Handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
  });
}