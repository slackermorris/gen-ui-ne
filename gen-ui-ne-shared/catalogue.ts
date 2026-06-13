import { Schema } from "effect";
import * as ComponentSchema from "./component-schema";

const elements = Object.values(ComponentSchema).map((s) => s.toCatalogueElement());
export const CatalogueElement = Schema.Union([...elements]);
export type CatalogueElement = typeof CatalogueElement.Type['type'];