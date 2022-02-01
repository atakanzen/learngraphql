import { GraphQLDate } from "graphql-scalars";
import { asNexusMethod } from "nexus";

export const GQLDate = asNexusMethod(GraphQLDate, "dateTime");
