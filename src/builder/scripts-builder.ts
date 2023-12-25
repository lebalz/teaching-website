import * as fs from "fs";
import {ScriptConfig } from "./models/script-config";
import {createDirTree, DirNode} from "./sync/dir-tree";
import * as osPath from "path";
import {MATERIAL_ROOT, SCRIPTS_ROOT} from "../../config/builder-config";
import {syncTrees} from "./sync/sync";

export function buildScripts(scriptsConfigsFile: string) {
  const scriptsConfigs = loadScriptsConfigs(scriptsConfigsFile);

  const materialTree = createMaterialTree();
  Object.entries(scriptsConfigs).forEach(([scriptRoot, scriptConfig]: [string, ScriptConfig]) => {
    buildScript(scriptRoot, scriptConfig, materialTree);
  });
  return Object.keys(scriptsConfigs);
}

function createMaterialTree(): DirNode {
  const materialRootPath = osPath.resolve(MATERIAL_ROOT);
  return createDirTree(materialRootPath);
}

function loadScriptsConfigs(scriptsConfigsName: string) {
  const scriptsConfigsPath = `config/scriptsConfigs/${scriptsConfigsName}`;
  if (!fs.existsSync(scriptsConfigsPath)) {
    throw `No such scriptsConfigs file: ${scriptsConfigsPath}`;
  }
  return JSON.parse(fs.readFileSync(scriptsConfigsPath).toString());
}

function buildScript(scriptRoot: string, scriptConfig: ScriptConfig, materialTree: DirNode) {
  console.log(`📝 Building script '${scriptRoot}'`);
  const scriptRootPath = osPath.resolve(osPath.join(SCRIPTS_ROOT, scriptRoot));
  const scriptTree = createDirTree(scriptRootPath);
  syncTrees(materialTree, scriptTree, scriptConfig);
}
