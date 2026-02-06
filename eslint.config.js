import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ["src/**/*.ts"],
		rules: {
			// Allow explicit any — 123 remain where genuinely needed
			"@typescript-eslint/no-explicit-any": "off",
			// Allow non-null assertions — used extensively for lifecycle guarantees
			"@typescript-eslint/no-non-null-assertion": "off",
			// Allow empty functions — show()/hide()/text() are intentional stubs
			"@typescript-eslint/no-empty-function": "off",
			// Allow this aliases — EventEmitter mixin pattern uses them
			"@typescript-eslint/no-this-alias": "off",
			// Warn on unused vars, but allow underscore-prefixed and rest siblings
			"@typescript-eslint/no-unused-vars": ["warn", {
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}],
			// Allow require — used in dynamic imports
			"@typescript-eslint/no-require-imports": "off",
			// Allow Function type — used in event emitter mixin pattern
			"@typescript-eslint/no-unsafe-function-type": "off",
			// Allow unused expressions — optional chaining side effects
			"@typescript-eslint/no-unused-expressions": "off",
			// Allow arguments object — legacy patterns in queue/event code
			"prefer-rest-params": "off",
			// Allow hasOwnProperty on target objects
			"no-prototype-builtins": "off",
			// Allow .apply() — spread alternatives break TypeScript with any[] args
			"prefer-spread": "off",
			// Prefer const where possible
			"prefer-const": "warn",
			// Warn on var usage (not error — some legacy patterns resist auto-fix)
			"no-var": "warn",
			// Flag console usage
			"no-console": "warn",
			// Enforce double quotes (project convention)
			"quotes": ["warn", "double"],
		}
	},
	{
		ignores: ["dist/", "node_modules/", "types/", "test/", "examples/"]
	}
);
