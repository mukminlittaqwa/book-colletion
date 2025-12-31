import { Book } from "~~/server/models/Book";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const session = await getUserSession(event);
  const books = await Book.find({ author: session.user?.id }).lean();
  return books.map((b) => ({ ...b, _id: b._id.toString() }));
});
