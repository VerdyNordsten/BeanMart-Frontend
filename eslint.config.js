import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react": react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React hooks rules
      ...reactHooks.configs.recommended.rules,
      
      // React-specific rules
      "react/prop-types": "off", // TypeScript handles this
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "react/jsx-uses-vars": "error", // Catch unused variables in JSX
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      
      // Error prevention rules
      "no-console": "warn", // Warn on console usage (use debug utilities instead)
      "no-debugger": "error", // No debugger statements in production
      "no-unused-vars": "off", // TypeScript handles this better
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn", // Discourage use of 'any'
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-shadow": "error",
      "prefer-const": "error",
      "no-var": "error",
      "prefer-template": "error",
      "no-duplicate-imports": "error",
      "prefer-destructuring": [
        "error",
        {
          "array": false,
          "object": true
        }
      ],
      "react-hooks/exhaustive-deps": "warn", // Warn about missing dependencies in useEffect
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      
      // Error handling
      "no-implicit-coercion": "error", // Prevent implicit type coercion
      "no-throw-literal": "error", // Only throw error objects
      "no-catch-shadow": "error", // Prevent shadowing catch variables
      "no-prototype-builtins": "error", // Prevent prototype method usage without proper check
    },
  },
  {
    files: ["tailwind.config.ts", "vite.config.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "import/no-extraneous-dependencies": "off", // Config files can import dev dependencies
    },
  },
);