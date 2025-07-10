
module.exports = (sequelize, DataTypes) => {
  const Machine = sequelize.define('Machine', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    reference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      validate: {
        len: [2, 50]
      }
    },
    model: {
      type: DataTypes.STRING,
      validate: {
        len: [2, 50]
      }
    },
    serialNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    installationDate: {
      type: DataTypes.DATE
    },
    warrantyEndDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('operational', 'maintenance', 'breakdown', 'retired'),
      defaultValue: 'operational'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium'
    },
    maintenanceSchedule: {
      type: DataTypes.STRING // "weekly", "monthly", "quarterly", etc.
    },
    lastMaintenanceDate: {
      type: DataTypes.DATE
    },
    nextMaintenanceDate: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'machines',
    timestamps: true
  });

  return Machine;
};
