import { idArg, objectType } from "nexus";

export const User = objectType({
  name: "User",
  description: "An object representation of a User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.list.nonNull.field("links", {
      type: "Link",
      resolve(source, args, { prisma }) {
        return prisma.user.findUnique({ where: { id: source.id } }).links();
      },
    });
    t.nonNull.list.nonNull.field("votes", {
      type: "Link",
      resolve(source, args, { prisma }) {
        return prisma.user.findUnique({ where: { id: source.id } }).votes();
      },
    });
  },
});
