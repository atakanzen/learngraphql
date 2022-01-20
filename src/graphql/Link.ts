import { extendType, objectType } from "nexus";
import { NexusGenObjects } from "../types/nexus-typegen";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("links", {
      type: Link,
      resolve(parent, args, context, info) {
        return links;
      },
    });
  },
});

// In-memory data (until a database is set)
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
    id: 2,
    url: "https://bit.ly/3rCI5lW",
    description: "Somewhere special.",
  },
];
