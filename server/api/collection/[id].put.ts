import { Book } from "~~/server/models/Book";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);
  const bookId = getRouterParam(event, "id");
  const body = await readBody(event);

  const book = await Book.findById(bookId);
  if (!book) {
    throw createError({ statusCode: 404, message: "Book not found" });
  }

  if (book.author.toString() !== session.user?.id) {
    throw createError({
      statusCode: 403,
      message: "Forbidden: You can only edit your own books",
    });
  }

  Object.assign(book, body);
  await book.save();

  return {
    success: true,
    book: { ...book.toObject(), _id: book._id.toString() },
  };
});
