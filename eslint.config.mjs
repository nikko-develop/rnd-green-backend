import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import _import from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [
	{
		ignores: ['node_modules/**/*', 'dist/**/*']
	},
	...compat.extends(
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	),
	{
		plugins: {
			'@typescript-eslint': typescriptEslint,
			import: fixupPluginRules(_import),
			jest
		},

		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest
			},

			parser: tsParser,
			ecmaVersion: 2022,
			sourceType: 'module',

			parserOptions: {
				project: './tsconfig.json'
			}
		},

		settings: {
			'import/resolver': {
				typescript: {}
			}
		},

		rules: {
			'no-unused-vars': 'off',
			'no-prototype-builtins': 'off',
			'import/prefer-default-export': 'off',
			'import/no-default-export': 'error',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'no-console': 'error',
			'no-unreachable': 'error',
			'arrow-body-style': ['error', 'as-needed'],
			'prefer-const': 'error',

			'object-curly-newline': [
				'error',
				{
					multiline: true,
					consistent: true
				}
			],

			camelcase: [
				'error',
				{
					properties: 'never'
				}
			],

			eqeqeq: ['error', 'always'],

			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal'],

					pathGroups: [
						{
							pattern: '@Libs/**',
							group: 'internal',
							position: 'before'
						},
						{
							pattern: '@Entities/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: '@Infrastructure/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: '@Modules/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: '@ValueObjects/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: '@Utils/**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: './**',
							group: 'internal',
							position: 'after'
						},
						{
							pattern: '../**',
							group: 'internal',
							position: 'after'
						}
					],

					pathGroupsExcludedImportTypes: ['builtin', 'external'],
					'newlines-between': 'always',

					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					}
				}
			]
		}
	},
	{
		files: ['**/*.spec.ts'],

		rules: {
			'@typescript-eslint/unbound-method': 'off',
			'jest/unbound-method': 'error'
		}
	}
];
