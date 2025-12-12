const fs = require('node:fs');
const path = require('node:path');
const {Sequelize} = require('sequelize');
const basename = path.basename(__filename);
const db = {};

let sequelize = new Sequelize(process.env.DB_URL);

try {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = db;
