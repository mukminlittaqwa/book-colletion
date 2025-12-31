import { Book } from "~~/server/models/Book";
import { User } from "~~/server/models/User";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const books = await Book.find().sort({ date: -1 }).lean();

  if (session.user) {
    const user = await User.findById(session.user.id);
    const bookmarkIds = user.bookmarks.map((b: string) => b.toString());
    return books.map((book) => ({
      ...book,
      _id: book._id.toString(),
      isBookmarked: bookmarkIds.includes(book._id.toString()),
    }));
  }

  return books.map((book) => ({
    ...book,
    _id: book._id.toString(),
    isBookmarked: false,
  }));
});
