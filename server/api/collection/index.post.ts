import { Book } from "~~/server/models/Book";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const body = await readBody(event);
  const session = await getUserSession(event);

  const book = await Book.create({ ...body, author: session.user?.id });
  return { _id: book._id.toString() };
});
