import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define the JSON Schema type
interface JSONSchema {
  type: string;
  properties?: { [key: string]: JSONSchema };
  required?: string[];
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
}

// Define the TreeNode interface (already provided)
interface TreeNode {
  id: string;
  title: string;
  nodeType: string;
  children: TreeNode[];
  parentId?: string | null;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  enum?: string[];
}

// Convert TreeNode structure to JSON Schema
export function convertToJsonSchema(node: TreeNode): JSONSchema {
  const schema: JSONSchema = { type: "" };

  // Determine the type of the node
  switch (node.nodeType) {
    case "object":
      schema.type = "object";
      schema.properties = {};
      schema.required = [];

      for (const child of node.children) {
        const childSchema = convertToJsonSchema(child);
        schema.properties[child.title] = childSchema;

        // Add required fields if necessary
        if (child.required) {
          schema.required.push(child.title);
        }
      }

      // If no required fields, remove the empty array
      if (schema.required.length === 0) {
        delete schema.required;
      }
      break;

    case "string":
      schema.type = "string";
      if (node.pattern) schema.pattern = node.pattern;
      if (node.minLength !== undefined) schema.minLength = node.minLength;
      if (node.maxLength !== undefined) schema.maxLength = node.maxLength;
      if (node.enum && node.enum.length > 0) schema.enum = node.enum;
      break;

    // Add more types as needed (number, boolean, etc.)
    default:
      schema.type = node.nodeType;
      break;
  }

  return schema;
}
