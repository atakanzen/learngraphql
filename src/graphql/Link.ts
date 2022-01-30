import {
  extendType,
  idArg,
  intArg,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus";
import { NexusGenObjects } from "../nexus-typegen";

export const Link = objectType({
  name: "Link",
  description: "An object representation of a link.",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.field("postedBy", {
      type: "User",
      resolve(source, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: source.id } })
          .postedBy();
      },
    });
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("links", {
      type: Link,
      description: "Returns all links",
      resolve(parent, args, { prisma }, info) {
        return prisma.link.findMany();
      },
    });

    t.nullable.field("link", {
      type: "Link",
      description: "Returns the link with the specified `id` argument",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, { id }, { prisma }) {
        return prisma.link.findUnique({
          where: {
            id,
          },
        });
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      description: "Creates a link with the given arguments",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, { description, url }, { prisma }) {
        return prisma.link.create({ data: { description, url } });
      },
    });

    t.nonNull.field("update", {
      type: "Link",
      description: "Updates a link with the given arguments",
      args: {
        id: nonNull(intArg({ description: "The ID of the link" })),
        url: nonNull(stringArg({ description: "The URL of the link" })),
        description: nonNull(
          stringArg({ description: "The description of the link" })
        ),
      },
      resolve(root, { id, url, description }, { prisma }) {
        return prisma.link.update({
          where: { id },
          data: { url, description },
        });
      },
    });

    t.nonNull.field("delete", {
      type: "Link",
      description: "Deletes a link with the given `id`",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, { id }, { prisma }) {
        return prisma.link.delete({ where: { id } });
      },
    });
  },
});

// A Sqlite database is integrated via Prisma. However, I want to leave these here.
// Sue me.
let links: NexusGenObjects["Link"][] = [
  {
    id: 1,
    url: "https://atakanzen.com",
    description: "Landing page of Atakan Zengin.",
  },
  {
    id: 2,
    url: "https://github.com/atakanzen",
    description: "Github page of Atakan Zengin.",
  },
  {
    id: 3,
    url: "https://bit.ly/3rCI5lW",
    description: "Somewhere special.",
  },
];
