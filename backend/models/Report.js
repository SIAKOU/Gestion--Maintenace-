
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
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
    workDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // en minutes
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
    technicianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    workType: {
      type: DataTypes.ENUM('maintenance', 'repair', 'inspection', 'installation', 'other'),
      allowNull: false
    },
    problemDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    actionsTaken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    partsUsed: {
      type: DataTypes.JSON // [{name: "piece", reference: "REF123", quantity: 2}]
    },
    toolsUsed: {
      type: DataTypes.JSON // ["tournevis", "multimètre", "clé"]
    },
    observations: {
      type: DataTypes.TEXT
    },
    recommendations: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'reviewed', 'approved'),
      defaultValue: 'draft'
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    reviewedAt: {
      type: DataTypes.DATE
    },
    reviewNotes: {
      type: DataTypes.TEXT
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium'
    }
  }, {
    tableName: 'reports',
    timestamps: true
  });

  return Report;
};
