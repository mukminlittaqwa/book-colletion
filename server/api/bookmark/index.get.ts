import { Book } from "~~/server/models/Book";
import { User } from "~~/server/models/User";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);

  const user = await User.findById(session.user?.id).populate("bookmarks");
  if (!user) {
    throw createError({ statusCode: 404, message: "user not found" });
  }

  const books = user.bookmarks.map((book: any) => ({
    ...book.toObject(),
    _id: book._id.toString(),
    isBookmarked: true,
  }));

  return books;
});
