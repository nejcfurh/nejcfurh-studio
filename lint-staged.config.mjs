import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = import.meta.dirname;
const ESLINT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.ts',
  '.tsx'
]);

// Each workspace package owns its prettier and eslint config, so staged files
// are grouped per package and checked with that package's own binaries.
function workspaceOf(file) {
  const [scope, name] = path.relative(root, file).split(path.sep);
  if (!['apps', 'packages', 'tooling'].includes(scope) || !name) return null;
  const dir = path.join(root, scope, name);
  const manifest = path.join(dir, 'package.json');
  if (!existsSync(manifest)) return null;
  return {
    dir,
    scripts: JSON.parse(readFileSync(manifest, 'utf8')).scripts ?? {}
  };
}

// Reads the extension list from the package's own `base:prettier` glob, e.g. './**/*.{ts,tsx,json}'.
function prettierExtensions(scripts) {
  const match = scripts['base:prettier']?.match(/\*\.\{([^}]+)\}/);
  return new Set(
    match ? match[1].split(',').map((ext) => `.${ext.trim()}`) : []
  );
}

const quote = (file) => JSON.stringify(file);

export default {
  '*': (files) => {
    const groups = new Map();
    for (const file of files) {
      const workspace = workspaceOf(file);
      if (!workspace) continue;
      const group = groups.get(workspace.dir) ?? { ...workspace, files: [] };
      group.files.push(file);
      groups.set(workspace.dir, group);
    }

    return [...groups.values()].flatMap(({ dir, scripts, files }) => {
      const commands = [];
      const extensions = prettierExtensions(scripts);
      const formattable = files.filter((file) =>
        extensions.has(path.extname(file))
      );
      if (formattable.length) {
        commands.push(
          `pnpm --dir ${quote(dir)} exec prettier --write --config .prettierrc --cache ${formattable.map(quote).join(' ')}`
        );
      }
      const lintable = files.filter((file) =>
        ESLINT_EXTENSIONS.has(path.extname(file))
      );
      if (scripts['base:eslint'] && lintable.length) {
        commands.push(
          `pnpm --dir ${quote(dir)} exec eslint --cache --no-warn-ignored ${lintable.map(quote).join(' ')}`
        );
      }
      return commands;
    });
  }
};
