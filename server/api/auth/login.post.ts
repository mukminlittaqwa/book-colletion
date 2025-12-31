import { User } from "~~/server/models/User";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError({ statusCode: 401, message: "invalid credentials" });
  }

  await setUserSession(event, {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
    },
    loggedInAt: new Date(),
  });

  return { success: true };
});
