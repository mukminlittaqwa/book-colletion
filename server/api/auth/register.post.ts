import { User } from "~~/server/models/User";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    throw createError({ statusCode: 400, message: "gagal uy" });

  const existing = await User.findOne({ email: parsed.data.email });
  if (existing)
    throw createError({ statusCode: 400, message: "email sudah ada kak" });

  const user = await User.create(parsed.data);
  await setUserSession(event, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });

  return { success: true };
});
