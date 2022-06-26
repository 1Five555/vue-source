/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 把模板转换成AST抽象语法树
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 优化抽象语法树
    optimize(ast, options)
  }
  // 把抽象语法树生成字符串形式的JS代码
  const code = generate(ast, options)
  return {
    ast,
    // 渲染函数
    // 这里的render并不是最后的render函数，而是字符串形式的，最后还要通过toFunction转换成函数的形式
    render: code.render,
    // 静态渲染函数，生成静态VNode树
    staticRenderFns: code.staticRenderFns
  }
})
