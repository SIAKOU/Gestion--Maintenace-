
module.exports = (sequelize, DataTypes) => {
  const FileAttachment = sequelize.define('FileAttachment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('image', 'video', 'document', 'audio', 'other'),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    interventionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'interventions',
        key: 'id'
      }
    },
    reportId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'reports',
        key: 'id'
      }
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'file_attachments',
    timestamps: true
  });

  return FileAttachment;
};
