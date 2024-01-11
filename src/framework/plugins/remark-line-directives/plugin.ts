import {Transformer} from "unified";
import {VFile} from "vfile";
import {Literal, Node, Parent} from "unist";
import {visit} from "unist-util-visit";
import {Directives} from "mdast-util-directive";
import {Optional} from "../../util/optional";
import {Log} from "../../util/log";
import {ensureEsmImports} from "../shared/util/mdast-util-esm-imports";
import {MdxJsxFlowElement, MdxJsxTextElement} from "mdast-util-mdx-jsx";
import {LineDirectiveDeclaration, LineDirectivesConfig} from "./model";
import {Link} from "mdast";

/** @type {import('unified').Plugin<[LineDirectivesConfig], MdastRoot>} */
export default function remarkLineDirectives(config: LineDirectivesConfig): Transformer {
  if (!config) {
    console.warn('remarkLineDirectives invoked without config: Plugin has no effect');
    return;
  }

  return (mdast: Parent, _: VFile) => {
    visit(mdast, (node: Node) => {
      return node.type === 'textDirective' || node.type === 'leafDirective';
    }, (directive: Directives, _: number, parent: Parent) => {
      switch(directive.type) {
        case 'textDirective':
          consumeDirective(config.textDirectives, directive, parent, mdast);
          break;
        case 'leafDirective':
          consumeDirective(config.leafDirectives, directive, parent, mdast);
          break;
      }
    });
  };
};

function consumeDirective(declarations: LineDirectiveDeclaration[], directive: Directives, parent: Parent, mdast: Parent) {
  matchDeclaration(declarations, directive).ifPresent(declaration => {
    const jsxElement = transform(directive, declaration);
    if (jsxElement.isEmpty()){
      Log.instance.warn(`Received no JSX element from TextDirectiveDeclaration '${declaration.name}'`);
      return;
    }

    parent.children[parent.children.indexOf(directive)] = jsxElement.get();
    ensureEsmImports(mdast, declaration.esmImports);
  });
}

function matchDeclaration(declarations: LineDirectiveDeclaration[], node: Directives): Optional<LineDirectiveDeclaration> {
  return Optional.of(declarations.find(declaration => declaration.name === node.name));
}

function transform(directive: Directives, declaration: LineDirectiveDeclaration): Optional<MdxJsxTextElement | MdxJsxFlowElement> {
  const children = directive.children;
  const literal = extractLiteral(children);
  return declaration.transform({
    ...directive.attributes,
    literal,
    children: [...children],
  });
}

function extractLiteral(children: Node[]): string {
  if (children.length !== 1) {
    return;
  }

  const child = children[0];
  if (child.type === 'text') {
    return (child as Literal).value as string;
  }
  if (child.type === 'link') {
    return (child as Link).url;
  }
}
