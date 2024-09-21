import {MATERIAL_ROOT} from "../../config/builderConfig";
import fs from "fs";
import osPath from "path";
import _ from "lodash";
import * as path from "node:path";
import {ScriptConfig, SectionMapping} from "./models/scriptConfig";

const MARKER_PATTERN = /(?<prefix>.*)\.\s*\[\s*(?<markers>([a-zA-Z0-9_.-]+(\s*,\s*[a-zA-Z0-9_-]+)*)?)\s*](?<suffix>.*)/;

class MaterialNode {

  _children: MaterialNode[] = [];
  _mappedTo: string = undefined;

  constructor(private _pathSegment: string, private _parent?: MaterialNode) {
  }

  appendChild(childPath: string): MaterialNode {
    const child = new MaterialNode(childPath, this);
    this._children.push(child);
    return child;
  }

  get canonicalPathSegment() {
    const match = this._pathSegment.match(MARKER_PATTERN);
    if (!match) {
      return this._pathSegment;
    }
    return `${match.groups['prefix']}${match.groups['suffix']}`;
  }

  get absPath() {
    if (this._parent) {
      return path.join(this._parent.absPath, this._pathSegment);
    }
    return path.resolve(path.join(MATERIAL_ROOT, this._pathSegment));
  }

  set mappedTo(mappedTo: string) {
    this._mappedTo = mappedTo;
  }

  get _relativeDestPath(): string | null {
    if (this._mappedTo) {
      return this._mappedTo;
    }
    if (this._parent?._relativeDestPath) {
      return path.join(this._parent._relativeDestPath, this.canonicalPathSegment);
    }
    return null;
  }

  destPath(scriptRootPath: string): string {
    if (this._relativeDestPath) {
      return path.join(scriptRootPath, this._relativeDestPath);
    }
    return undefined;
  }

  findNode(nodePath: string): MaterialNode {
    const pathSegments = nodePath.split(path.sep);
    console.log(pathSegments);
    return this.findNodeByPathSegments(pathSegments);
  }

  findNodeByPathSegments(pathSegments: string[]): MaterialNode {
    const childName = pathSegments[0];
    console.log({pathSegments, myPathSegment: this._pathSegment})
    const child = this._children.find((candidate: MaterialNode) => candidate._pathSegment === childName);

    if (!child) {
      return undefined;
    }

    if (pathSegments.length === 1) {
      return child;
    }

    child.findNodeByPathSegments(pathSegments.slice(1));
  }
}

function _createMaterialRootTree() {
  const materialTree = new MaterialNode('');
  _createTree(materialTree, MATERIAL_ROOT);
  return materialTree;
}

function _createTree(currentNode: MaterialNode, currentAbsPath: string) {
  if (!fs.existsSync(currentAbsPath)) {
    return;
  }
  fs.readdirSync(currentAbsPath).forEach(childPath => {
    const childAbsPath = osPath.join(currentAbsPath, childPath);
    if (fs.statSync(childAbsPath).isFile()) {
      currentNode.appendChild(childPath);
    } else {
      const childNode = currentNode.appendChild(childPath);
      _createTree(childNode, childAbsPath);
    }
  });
}

function _determineMostSignificantChildren(competingChildren: MaterialNode[]): MaterialNode[] {
  const childrenWithExplicitMapping = competingChildren.filter((child: MaterialNode) => !!child._mappedTo);
  if (childrenWithExplicitMapping) {
    return childrenWithExplicitMapping;
  }
  return competingChildren; // TODO: Only include the one child (as array) with the best marker.
}

function _pruneCompetingChildren(node: MaterialNode) {
  const childGroups = _.groupBy(node._children, 'canonicalPathSegment');
  // map child groups to a new children array containing only the most significant child in each group
  // repeat for all children
  node._children = Object.values(childGroups).flatMap((competingChildren: MaterialNode[]) => {
    return _determineMostSignificantChildren(competingChildren);
  });
  node._children.forEach((childNode: MaterialNode) => _pruneCompetingChildren(childNode));
}

function _applyMappings(root: MaterialNode, scriptConfig: ScriptConfig) {
  scriptConfig.mappings.forEach((mapping: SectionMapping) => {
    const node = root.findNode(mapping.material);
    if (!node) {
      throw new Error(`Can't find material node '${mapping.material}.'`);
    }
    node.mappedTo = mapping.section;
  });
}

function _collectSyncPairs(scriptRootPath: string, node: MaterialNode) {
  const syncPairs = [];
  const destPath = node.destPath(scriptRootPath);
  if (destPath) {
    syncPairs.push([node.absPath, destPath]);
  }
  syncPairs.push(...node._children.flatMap((child: MaterialNode) => _collectSyncPairs(scriptRootPath, child)));
  return syncPairs;
}

export function syncMaterialForScript(scriptRootPath: string, scriptConfigs: ScriptConfig) {
  const materialTree = _createMaterialRootTree();
  console.log(materialTree);
  // _applyMappings(materialTree, scriptConfigs);
  // _pruneCompetingChildren(materialTree);
  // const syncPairs = _collectSyncPairs(scriptRootPath, materialTree);
  // console.log(syncPairs);
}