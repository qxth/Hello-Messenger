const api = "/chatter/"
const routes = {
  createUser: `${api}createuser`,
  logIn: `${api}login`,
  getAllFriends: `${api}friends`,
  stashFriends: `${api}stashfriends`,
  getChat: `${api}chat`,
  addFriends: `${api}addfriends`,
  acceptFriends: `${api}acceptfriends`,
  rejectFriends: `${api}rejectfriends`,
  verificarToken: `${api}verificarToken`,
  getQuestions: `${api}questions`,
  getFileMessage: `${api}getfile`
};

export default routes;
