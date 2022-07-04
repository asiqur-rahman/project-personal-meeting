module.exports = (sequelize, Sequelize) => {
  const ContactType = sequelize.define("contactType", {
    id: {
      type: Sequelize.INTEGER(11),
      allownull:false,
      autoIncrement:true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(),
      allowNull:false,
      validate:{
        notNull:{ args: true, msg: "Name cannot be empty !!"}
      }
    },
    code: {
      type: Sequelize.STRING(),
      allowNull:false,
      unique:true,
      validate:{
        notNull:{ args: true, msg: "Code cannot be empty !!"}
      }
    },
    description: {
      type: Sequelize.STRING(),
      allowNull:true,
    },
    isActive: {
      type: Sequelize.BOOLEAN(),
      allowNull:false,
      defaultValue: true
    } 
  },
  
  {
    defaultScope: {
      where:{
        isActive: true
      },
      attributes: {
         exclude: ['createdAt','updatedAt']
      }
    },
    scopes: {
      notActive: {
        where:{
          isActive: false
        },
        attributes: {
           exclude: ['id','createdAt','updatedAt']
        }
      },
      allData: {
        where:{

        },
        attributes: {
           exclude: ['id','createdAt','updatedAt']
        }
      }
  }
});
  return ContactType;
};
