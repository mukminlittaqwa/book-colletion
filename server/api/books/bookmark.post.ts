import { User } from "~~/server/models/User";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const { bookId } = await readBody(event);
  const session = await getUserSession(event);

  const user = await User.findById(session.user?.id);
  if (!user) {
    throw createError({ statusCode: 404, message: "user not found" });
  }

  const index = user.bookmarks.indexOf(bookId);
  if (index === -1) {
    user.bookmarks.push(bookId);
  } else {
    user.bookmarks.splice(index, 1);
  }
  await user.save();

  return { success: true };
});
