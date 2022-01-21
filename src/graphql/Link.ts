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
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.nonNull.field("links", {
      type: Link,
      resolve(parent, args, context, info) {
        return links;
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, { description, url }, context) {
        let nextId = (links.length + 1).toString();
        const link = {
          id: nextId,
          description,
          url,
        };
        links.push(link);

        return link;
      },
    });
    t.nonNull.field("delete", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
      },
      resolve(parent, { id }, context) {
        const deleteIndex = links.findIndex((link) => link.id === id);
        const copiedLink = links[deleteIndex];
        links.splice(deleteIndex, 1);
        return copiedLink;
      },
    });
  },
});

// In-memory data (until a database is set)
let links: NexusGenObjects["Link"][] = [
  {
    id: "1",
    url: "https://atakanzen.com",
    description: "Landing page of Atakan Zengin.",
  },
  {
    id: "2",
    url: "https://github.com/atakanzen",
    description: "Github page of Atakan Zengin.",
  },
  {
    id: "3",
    url: "https://bit.ly/3rCI5lW",
    description: "Somewhere special.",
  },
];
