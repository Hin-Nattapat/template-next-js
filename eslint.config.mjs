// eslint.config.mjs
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwindcss from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // ================================
  // 1. Next.js Recommended Rules
  // ================================
  ...nextCoreWebVitals,
  ...nextTypescript,

  // ================================
  // 2. Prettier Integration (Flat)
  //    Ensures ESLint does NOT conflict with Prettier
  // ================================
  prettier,

  // ================================
  // 3. React Hooks Rules
  // ================================
  reactHooks.configs.flat.recommended,

  // ================================
  // 4. TS + Imports + Clean Code Rules
  // ================================
  {
    name: "typescript-and-imports",
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.d.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      // ---- Import Sorting ----
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // ---- Unused Imports / Vars ----
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",

      // ---- Console + Debug ----
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",

      // ---- Control Flow + Truthiness ----
      curly: ["error", "all"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='Boolean']",
          message: "Use !!x or a plain truthy check. `.filter(Boolean)` is fine.",
        },
      ],

      // ---- Exhaustive switches over enums and unions (needs typed linting) ----
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // ---- TypeScript Strict-ish ----
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
        },
      ],
    },
  },

  // ================================
  // 5. Tailwind CSS (v4 + plugin beta)
  // ================================
  {
    name: "tailwindcss",
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        // Tailwind v4 ไม่มี tailwind.config.js แล้ว
        config: false,
        // ให้ plugin ไปอ่าน token/utility จากไฟล์ CSS (global.css)
        cssFiles: ["**/*.css"],
        // ถ้าใช้ helper รวม class เช่น cn()
        callees: ["cn"],
      },
    },
    rules: {
      // ✅ ใช้ได้โอเคกับ v4
      "tailwindcss/classnames-order": "warn",
      // ถ้าอยาก strict shorthand ค่อยเปิดทีหลัง
      "tailwindcss/enforces-shorthand": "off",

      // ❌ ปิดไว้ก่อนใน v4 beta — false positive เยอะ
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/no-contradicting-classname": "off",
      "tailwindcss/no-unnecessary-arbitrary-value": "off",
    },
  },

  // ================================
  // 6. Global Ignores
  // ================================
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "coverage/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);
