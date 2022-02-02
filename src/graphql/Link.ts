import { Prisma } from "@prisma/client";
import {
  arg,
  enumType,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { NexusGenObjects } from "../nexus-typegen";

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
    t.field("description", { type: Sort });
    t.field("url", { type: Sort });
    t.field("createdAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const Link = objectType({
  name: "Link",
  description: "An object representation of a link.",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.dateTime("createdAt");
    t.field("postedBy", {
      type: "User",
      resolve(source, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: source.id } })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(source, args, { prisma }) {
        return prisma.link.findUnique({ where: { id: source.id } }).voters();
      },
    });
  },
});

export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: "Link" });
    t.nonNull.int("count");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feed", {
      type: "Feed",
      args: {
        filter: stringArg({ description: "Filter for links" }),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }),
      },
      description: "Returns all links",
      async resolve(source, { filter, skip, take, orderBy }, { prisma }) {
        const where = filter
          ? {
              OR: [
                { description: { contains: filter } },
                { url: { contains: filter } },
              ],
            }
          : {};

        const links = await prisma.link.findMany({
          where,
          skip: skip as number | undefined,
          take: take as number | undefined,
          orderBy: orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined,
        });

        const count = await prisma.link.count({ where });

        return {
          links,
          count,
        };
      },
    });

    t.nullable.field("link", {
      type: "Link",
      description: "Returns the link with the specified `id` argument",
      args: {
        id: nonNull(intArg()),
      },
      resolve(source, { id }, { prisma }) {
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
      resolve(source, { description, url }, { prisma, userId }) {
        if (!userId) {
          throw new Error("Cannot create link without logging in");
        }

        const newLink = prisma.link.create({
          data: { description, url, postedBy: { connect: { id: userId } } },
        });

        return newLink;
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
      resolve(source, { id }, { prisma }) {
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
    createdAt: null,
  },
  {
    id: 2,
    url: "https://github.com/atakanzen",
    description: "Github page of Atakan Zengin.",
    createdAt: null,
  },
  {
    id: 3,
    url: "https://bit.ly/3rCI5lW",
    description: "Somewhere special.",
    createdAt: null,
  },
];
