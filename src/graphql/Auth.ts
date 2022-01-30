import { extendType, nonNull, objectType, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const AuthPayload = objectType({
  name: "AuthPayload",
  description: "An object representation of an authentication payload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      description: "Signs up a new user with the given arguments",
      args: {
        email: nonNull(stringArg({ description: "User email" })),
        password: nonNull(stringArg({ description: "User password" })),
        name: nonNull(stringArg({ description: "User name" })),
      },
      async resolve(source, { email, password, name }, context) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await context.prisma.user.create({
          data: { email, password: hashedPassword, name },
        });

        const token = jwt.sign(
          { userId: user.id },
          process.env.APP_SECRET as string
        );

        return {
          token,
          user,
        };
      },
    });

    t.nonNull.field("login", {
      type: "AuthPayload",
      description: "Logs in a user with the given arguments",
      args: {
        email: nonNull(stringArg({ description: "User email" })),
        password: nonNull(stringArg({ description: "User password" })),
      },
      async resolve(source, { email, password }, context) {
        const user = await context.prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new Error("User does not exist");
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { userId: user.id },
          process.env.APP_SECRET as string
        );

        return {
          token,
          user,
        };
      },
    });
  },
});
