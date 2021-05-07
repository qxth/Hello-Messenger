const api = "/chatter/";
const routes = {
  createUser: `${api}createUser`,
  iniciarSesion: `${api}login`,
  getAllFriends: `${api}friends`,
  stashFriends: `${api}stashfriends`,
  getChat: `${api}chat`,
  addFriends: `${api}addfriends`,
  acceptFriends: `${api}acceptfriends`,
  rejectFriends: `${api}rejectfriends`,
  verificarToken: `${api}verificarToken`,
  getQuestions: `${api}getquestions`,
};

export default routes;
