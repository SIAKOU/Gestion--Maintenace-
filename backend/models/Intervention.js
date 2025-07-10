
module.exports = (sequelize, DataTypes) => {
  const Intervention = sequelize.define('Intervention', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    urgency: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    type: {
      type: DataTypes.ENUM('preventive', 'corrective', 'emergency'),
      allowNull: false
    },
    machineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'machines',
        key: 'id'
      }
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    technicianId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    requestDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    assignedDate: {
      type: DataTypes.DATE
    },
    startDate: {
      type: DataTypes.DATE
    },
    completedDate: {
      type: DataTypes.DATE
    },
    estimatedDuration: {
      type: DataTypes.INTEGER // en minutes
    },
    actualDuration: {
      type: DataTypes.INTEGER // en minutes
    },
    diagnosis: {
      type: DataTypes.TEXT
    },
    solution: {
      type: DataTypes.TEXT
    },
    partsUsed: {
      type: DataTypes.JSON // [{name: "piece", quantity: 2, cost: 50}]
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'interventions',
    timestamps: true
  });

  return Intervention;
};
