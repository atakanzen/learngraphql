import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  description: "An object representation of a User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.list.nonNull.field("links", {
      type: "Link",
      resolve(source, args, context) {
        return context.prisma.user
          .findUnique({ where: { id: source.id } })
          .links();
      },
    });
  },
});
