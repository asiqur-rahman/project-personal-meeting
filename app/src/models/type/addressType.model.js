module.exports = (sequelize, Sequelize) => {
  const AddressType = sequelize.define("addressType", {
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
      allowNull:{ args: false, msg: "Code cannot be empty !!"},
      unique:{ args: true, msg: "Code Already Used"},
    },
    // secret: {
    //   type: Sequelize.UUID,
    //   defaultValue: Sequelize.UUIDV4,
    //   unique:true,
    //   allowNull: false,
    // },
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
  return AddressType;
};
