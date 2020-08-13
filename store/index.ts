import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
  loading: false,
  search: '',
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {}

export const mutations: MutationTree<RootState> = {
  LOADING_ON: (state) => (state.loading = true),
  LOADING_OFF: (state) => (state.loading = false),
  SEARCH: (state, payload: string) => (state.search = payload),
}

export const actions: ActionTree<RootState, RootState> = {}
