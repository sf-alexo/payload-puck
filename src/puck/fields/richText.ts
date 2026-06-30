import { TextStyle, Color, FontSize, BackgroundColor } from '@tiptap/extension-text-style'

// Minimal structural type for the TipTap editor instance Puck passes in.
// Avoids importing @tiptap/react directly (it is only a transitive dep here).
// The real Editor is structurally assignable to this.
export type RichTextEditor = {
  chain: () => any
  getAttributes: (name: string) => Record<string, any>
}

// TipTap extensions that power the custom styles dropdown + color picker.
// TextStyle is the base mark; Color/FontSize/BackgroundColor add inline-style
// attributes onto it so formatting is self-contained in the saved HTML and
// renders on the public site without any extra CSS.
//
// IMPORTANT: this module must NOT be a 'use client' module. It is imported by
// puck.config, which the server-side <Render> consumes. If these plain values
// lived in a client module, Next would replace them with client reference
// proxies on the server, breaking iteration ("extensions is not iterable").
export const richTextExtensions = [TextStyle, Color, FontSize, BackgroundColor]

// Exposes the current mark state to the toolbar so controls can reflect it.
// Selector return values must be booleans (Puck merges them into editorState).
export const richTextSelector = ({ editor }: { editor: RichTextEditor | null }) => {
  const textStyle = editor?.getAttributes('textStyle') ?? {}
  return {
    isLead: textStyle.fontSize === '1.25em',
    isSmall: textStyle.fontSize === '0.85em',
    isMuted: textStyle.color === '#6b7280',
    isHighlight: Boolean(textStyle.backgroundColor),
    hasColor: Boolean(textStyle.color),
  }
}
