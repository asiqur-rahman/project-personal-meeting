const config = require("../../../config.json");
const mysql2 = require('mysql2');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB_CONFIG.DBNAME,
    config.DB_CONFIG.USER,
    config.DB_CONFIG.PASS, {
        host: config.DB_CONFIG.HOST,
        dialect: config.DB_CONFIG.DIALECT,
        operatorsAliases: 0,

        pool: {
            max: config.DB_CONFIG.POOL.MAX,
            min: config.DB_CONFIG.POOL.MIN,
            acquire: config.DB_CONFIG.POOL.ACQUIRE,
            idle: config.DB_CONFIG.POOL.IDLE
        }
    }
);
sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.role = require("./admin/role.model.js")(sequelize, Sequelize);
db.sendMail = require("./admin/sendMail.model")(sequelize, Sequelize);

db.addressType = require("./type/addressType.model")(sequelize, Sequelize);
db.contactType = require("./type/contactType.model")(sequelize, Sequelize);

db.user = require("./user/user.model")(sequelize, Sequelize);
db.userAddress = require("./user/userAddress.model")(sequelize, Sequelize);
db.userContact = require("./user/userContact.model")(sequelize, Sequelize);
db.userDetails = require("./user/userDetails.model")(sequelize, Sequelize);

//Associations

//admin --------------------------------------------
//userTable
db.user.belongsTo(db.role,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.role.hasMany(db.user);

//user --------------------------------------------
//userAddressTable
db.userAddress.belongsTo(db.user,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.user.hasMany(db.userAddress);

db.userAddress.belongsTo(db.addressType,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.addressType.hasMany(db.userAddress);

//userContactTable
db.userContact.belongsTo(db.user,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.user.hasMany(db.userContact);

db.userContact.belongsTo(db.contactType,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.contactType.hasMany(db.userContact);

//userDetailsTable
db.userDetails.belongsTo(db.user,{ foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
db.user.hasOne(db.userDetails);


module.exports = db;