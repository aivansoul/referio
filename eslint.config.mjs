import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", "convex/_generated/**", "dist/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ["**/*.ts"], languageOptions: { parserOptions: { project: "./tsconfig.json" } } }
);
