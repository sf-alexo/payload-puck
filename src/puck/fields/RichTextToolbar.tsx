'use client'

import React from 'react'
import type { ReactNode } from 'react'
import { RichTextMenu } from '@puckeditor/core'
import type { RichTextEditor as Editor } from './richText'

// Named presets applied by the "Styles" dropdown. Each preset maps to a set of
// inline-style commands, so changing a definition here updates every block.
const STYLE_PRESETS = [
  { value: 'default', label: 'Normal text' },
  { value: 'lead', label: 'Lead paragraph' },
  { value: 'small', label: 'Small text' },
  { value: 'muted', label: 'Muted' },
  { value: 'highlight', label: 'Highlight' },
] as const

type PresetValue = (typeof STYLE_PRESETS)[number]['value']

const applyPreset = (editor: Editor | null, preset: PresetValue) => {
  if (!editor) return
  const chain = editor.chain().focus().unsetFontSize().unsetColor().unsetBackgroundColor()
  switch (preset) {
    case 'lead':
      chain.setFontSize('1.25em')
      break
    case 'small':
      chain.setFontSize('0.85em')
      break
    case 'muted':
      chain.setColor('#6b7280')
      break
    case 'highlight':
      chain.setBackgroundColor('#fef08a')
      break
    case 'default':
    default:
      break
  }
  chain.run()
}

// Loose shape so Puck's full EditorState (default keys + our selector keys)
// is assignable. We only read the boolean flags produced by richTextSelector.
type ToolbarState = Record<string, boolean | undefined>

type RichTextToolbarProps = {
  children: ReactNode
  editor: Editor | null
  editorState: ToolbarState | null
  readOnly: boolean
}

const ClearColorIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l18 18M9.5 5.5L12 3l7 7-2.5 2.5M5 19h14" />
  </svg>
)

export function RichTextToolbar({ children, editor, editorState, readOnly }: RichTextToolbarProps) {
  const currentPreset: PresetValue = editorState?.isLead
    ? 'lead'
    : editorState?.isSmall
      ? 'small'
      : editorState?.isMuted
        ? 'muted'
        : editorState?.isHighlight
          ? 'highlight'
          : 'default'

  const currentColor = (editor?.getAttributes('textStyle').color as string) ?? '#000000'

  return (
    <RichTextMenu>
      {children}
      <RichTextMenu.Group>
        <select
          aria-label="Text style"
          title="Text style"
          value={currentPreset}
          disabled={readOnly}
          onChange={(e) => applyPreset(editor, e.target.value as PresetValue)}
          style={{
            height: 28,
            border: '1px solid #d1d5db',
            borderRadius: 6,
            background: '#fff',
            fontSize: '0.8rem',
            padding: '0 6px',
            cursor: 'pointer',
          }}
        >
          {STYLE_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </RichTextMenu.Group>
      <RichTextMenu.Group>
        <label
          title="Text color"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            height: 28,
            padding: '0 6px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            cursor: readOnly ? 'default' : 'pointer',
            background: '#fff',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>A</span>
          <input
            type="color"
            aria-label="Text color"
            value={currentColor}
            disabled={readOnly}
            onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
            style={{ width: 22, height: 18, border: 'none', background: 'none', padding: 0, cursor: 'inherit' }}
          />
        </label>
        <RichTextMenu.Control
          title="Clear color"
          icon={ClearColorIcon}
          disabled={readOnly || !editorState?.hasColor}
          onClick={() => editor?.chain().focus().unsetColor().run()}
        />
      </RichTextMenu.Group>
    </RichTextMenu>
  )
}
