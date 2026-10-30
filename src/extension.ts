// Chalk Talk for VS Code: in the Markdown preview, ```chalk-talk (the text syntax or JSON) and ```chalk-mermaid (a
// Mermaid diagram) fences become hand-drawn lessons. The fences become blocks here (chalk-talk/markdown, for VS Code's
// markdown-it); the preview's script (media/mount.global.js) turns the blocks into lessons. Nothing goes over the network.
import { markdownItChalkTalk } from 'chalk-talk/markdown'

export function activate() {
  return {
    extendMarkdownIt<T>(md: T): T {
      return markdownItChalkTalk(md)
    },
  }
}
