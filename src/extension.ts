// DNA for VS Code: in the Markdown preview, ```visual-explainer (the text syntax or JSON) and ```visual-explainer-mermaid
// (a Mermaid diagram) fences — and ```chalk-talk / ```chalk-mermaid from before — become explainers that draw themselves.
// The fences become blocks here (@ruinosus/visual-explainer/markdown, for VS Code's
// markdown-it); the preview's script (media/mount.global.js) turns the blocks into explainers. Nothing goes over the network.
import { markdownItVisualExplainer } from '@ruinosus/visual-explainer/markdown'

export function activate() {
  return {
    extendMarkdownIt<T>(md: T): T {
      return markdownItVisualExplainer(md)
    },
  }
}
