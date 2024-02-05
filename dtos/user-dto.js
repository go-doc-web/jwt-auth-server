function createUserDto(model) {
  return {
    email: model.email,
    id: model._id,
    isActivated: model.isActivated,
  };
}

module.exports = createUserDto;

// module.export = class UserDto {
//   email;
//   id;
//   isActivated;

//   constructor(model) {
//     this.email = model.email;
//     this.id = model._id;
//     this.isActivated = model.isActivated;
//   }
// };
