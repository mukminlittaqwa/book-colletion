export default defineNuxtRouteMiddleware(async (to) => {
  const session = useUserSession();
  await session.fetch();

  if (!session.loggedIn.value) {
    return navigateTo("/login");
  }
});
