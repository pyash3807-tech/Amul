const PostgresModel = require('./PostgresModel');
const PostgresModelInstance = require('./PostgresModelInstance');

function createModel(tableName) {
  const modelHelper = new PostgresModel(tableName);

  class ModelClass extends PostgresModelInstance {
    constructor(data) {
      super(modelHelper, data);
    }
  }

  // Copy standard static query methods from PostgresModel proto to ModelClass
  const proto = Object.getPrototypeOf(modelHelper);
  const methods = Object.getOwnPropertyNames(proto)
    .filter(m => m !== 'constructor' && !m.startsWith('_'));
  
  for (let m of methods) {
    ModelClass[m] = modelHelper[m].bind(modelHelper);
  }

  return ModelClass;
}

module.exports = createModel;
