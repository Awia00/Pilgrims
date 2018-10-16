import { ChatMessage } from '../../../../pilgrims-shared/dist/Shared';
import { GetterTree, MutationTree, ActionTree, ActionContext } from 'vuex';
import { SocketWrapper } from '../store';

// The state
export class State {
  public messages: ChatMessage[] = [];
}

// Synchrounous getters: GetterTree<local state, root state>
const getters: GetterTree<State, any> = {
  getMessages(state: State): ChatMessage[] {
    return state.messages;
  },
};

// Synchrounous setters MutationTree<local state, root state>
const mutations: MutationTree<State> = {
  addMessage(state: State, message: ChatMessage) {
    state.messages.unshift(message);
  },
  setMessages(state: State, messages: ChatMessage[]) {
    state.messages = messages.slice(0);
  },
};

// Async methods
const actions: ActionTree<State, State> = {
  async bindToMessages(
    { commit }: ActionContext<State, State>) {
      // Connect to socket and setup listener for listening to events.
    SocketWrapper.getSocket().on('chat', (message: ChatMessage) => {
      commit('addMessage', message);
    });
  },
  async addMessage(
    { commit }: ActionContext<State, State>,
    message: ChatMessage) {
    // emit chat message to socket.
    SocketWrapper.getSocket().emit('chat', message);
  },
};

export default {
  namespaced: true,
  state: new State(),
  getters,
  actions,
  mutations,
};
