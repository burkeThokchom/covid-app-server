const { addUser, updateUser, deleteUser, login } = require('./UserMutation');
const { addCase } = require('./CaseMutation');

module.exports = {
    addUser, 
    updateUser, 
    deleteUser,
    login,
    addCase
}