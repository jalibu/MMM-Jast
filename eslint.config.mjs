// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import jsdoc from 'eslint-plugin-jsdoc'
import tseslint from 'typescript-eslint'

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  jsdoc.configs['flat/recommended-typescript'],
  {
    ignores: ['MMM-Jast.js', 'node_helper.js']
  }
)
