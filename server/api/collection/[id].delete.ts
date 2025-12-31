import { Book } from "~~/server/models/Book";
import { User } from "~~/server/models/User";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);
  const bookId = getRouterParam(event, "id");

  const book = await Book.findById(bookId);
  if (!book) {
    throw createError({
      statusCode: 404,
      message: "tidak ada buku yang di temukan jreng jreng",
    });
  }

  if (book.author.toString() !== session.user?.id) {
    throw createError({
      statusCode: 403,
      message: "hayo loh login sik",
    });
  }

  await User.updateMany(
    { bookmarks: bookId },
    { $pull: { bookmarks: bookId } }
  );

  await Book.deleteOne({ _id: bookId });

  return { success: true };
});
