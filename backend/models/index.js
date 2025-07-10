
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool
  }
);

// Import des modèles
const User = require('./User')(sequelize, DataTypes);
const Machine = require('./Machine')(sequelize, DataTypes);
const Intervention = require('./Intervention')(sequelize, DataTypes);
const Report = require('./Report')(sequelize, DataTypes);
const FileAttachment = require('./FileAttachment')(sequelize, DataTypes);
const AuditLog = require('./AuditLog')(sequelize, DataTypes);

// Définition des associations
const db = {
  User,
  Machine,
  Intervention,
  Report,
  FileAttachment,
  AuditLog,
  sequelize,
  Sequelize
};

// Relations
User.hasMany(Intervention, { foreignKey: 'technicianId', as: 'assignedInterventions' });
User.hasMany(Intervention, { foreignKey: 'requesterId', as: 'requestedInterventions' });
User.hasMany(Report, { foreignKey: 'technicianId', as: 'reports' });

Machine.hasMany(Intervention, { foreignKey: 'machineId', as: 'interventions' });
Machine.hasMany(Report, { foreignKey: 'machineId', as: 'reports' });

Intervention.belongsTo(User, { foreignKey: 'technicianId', as: 'technician' });
Intervention.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Intervention.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });
Intervention.hasMany(FileAttachment, { foreignKey: 'interventionId', as: 'attachments' });

Report.belongsTo(User, { foreignKey: 'technicianId', as: 'technician' });
Report.belongsTo(Machine, { foreignKey: 'machineId', as: 'machine' });
Report.hasMany(FileAttachment, { foreignKey: 'reportId', as: 'attachments' });

FileAttachment.belongsTo(Intervention, { foreignKey: 'interventionId', as: 'intervention' });
FileAttachment.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });

module.exports = db;
