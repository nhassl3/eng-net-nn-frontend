import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AdminState {
  // Вакансии
  vacancyCreateOpen: boolean;
  vacancyViewId: string | null;
  vacancyEditId: string | null;
  vacancyDeleteId: string | null;
  respondsVacancyId: string | null;
  respondReplyId: string | null;
  // Профили
  vacancyJdCreateOpen: boolean;
  vacancyJdViewId: number | null;
  vacancyJdEditId: number | null;
  vacancyJdDeleteId: number | null;
  // Планы
  planViewId: string | null;
  planReplyId: string | null;
  // Списки перезапрашиваются, когда токен меняется
  listRefreshToken: number;
}

const initialState: AdminState = {
  vacancyCreateOpen: false,
  vacancyJdCreateOpen: false,
  vacancyViewId: null,
  vacancyEditId: null,
  vacancyDeleteId: null,
  vacancyJdViewId: null,
  vacancyJdEditId: null,
  vacancyJdDeleteId: null,
  respondsVacancyId: null,
  respondReplyId: null,
  planViewId: null,
  planReplyId: null,
  listRefreshToken: 0,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    openVacancyCreate(state) { state.vacancyCreateOpen = true; },
    closeVacancyCreate(state) { state.vacancyCreateOpen = false; },

    openVacancyJdCreate(state) { state.vacancyJdCreateOpen = true; },
    closeVacancyJdCreate(state) { state.vacancyJdCreateOpen = false; },

    openVacancyView(state, action: PayloadAction<string>) { state.vacancyViewId = action.payload; },
    closeVacancyView(state) { state.vacancyViewId = null; },

    openVacancyEdit(state, action: PayloadAction<string>) { state.vacancyEditId = action.payload; },
    closeVacancyEdit(state) { state.vacancyEditId = null; },

    openVacancyDelete(state, action: PayloadAction<string>) { state.vacancyDeleteId = action.payload; },
    closeVacancyDelete(state) { state.vacancyDeleteId = null; },

    openVacancyJdView(state, action: PayloadAction<number>) { state.vacancyJdViewId = action.payload; },
    closeVacancyJdView(state) { state.vacancyJdViewId = null; },

    openVacancyJdEdit(state, action: PayloadAction<number>) {state.vacancyJdEditId = action.payload; },
    closeVacancyJdEdit(state) { state.vacancyJdEditId = null; },

    openVacancyJdDelete(state, action: PayloadAction<number>) {state.vacancyJdDeleteId = action.payload; },
    closeVacancyJdDelete(state) { state.vacancyJdDeleteId = null; },

    openResponds(state, action: PayloadAction<string>) { state.respondsVacancyId = action.payload; },
    closeResponds(state) { state.respondsVacancyId = null; state.respondReplyId = null; },

    // Открывается поверх списка откликов — respondsVacancyId намеренно не сбрасываем
    openRespondReply(state, action: PayloadAction<string>) { state.respondReplyId = action.payload; },
    closeRespondReply(state) { state.respondReplyId = null; },

    openPlanView(state, action: PayloadAction<string>) { state.planViewId = action.payload; },
    closePlanView(state) { state.planViewId = null; },

    openPlanReply(state, action: PayloadAction<string>) { state.planReplyId = action.payload; },
    closePlanReply(state) { state.planReplyId = null; },

    refreshAdminLists(state) { state.listRefreshToken += 1; },

    resetAdmin() { return initialState; },
  },
});

export const {
  openVacancyCreate, closeVacancyCreate,
  openVacancyJdCreate, closeVacancyJdCreate,
  openVacancyView, closeVacancyView,
  openVacancyEdit, closeVacancyEdit,
  openVacancyDelete, closeVacancyDelete,
  openVacancyJdView, closeVacancyJdView,
  openVacancyJdEdit, closeVacancyJdEdit,
  openVacancyJdDelete, closeVacancyJdDelete,
  openResponds, closeResponds,
  openRespondReply, closeRespondReply,
  openPlanView, closePlanView,
  openPlanReply, closePlanReply,
  refreshAdminLists, resetAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;
