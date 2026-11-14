type SignOutActions = {
  cancelQueries: () => Promise<unknown>;
  clearQueries: () => void;
  endSession: () => Promise<{ error: unknown }>;
  clearProfile: () => void;
  goToLogin: () => Promise<unknown>;
};

export async function signOutAccount(actions: SignOutActions) {
  await actions.cancelQueries();
  actions.clearQueries();
  const { error } = await actions.endSession();
  if (error) throw error;
  actions.clearProfile();
  await actions.goToLogin();
}