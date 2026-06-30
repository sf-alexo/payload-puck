import Link from 'next/link'
import React from 'react'
import type { BeforeListServerProps } from 'payload'

import type { Page } from '@/payload-types'

type TreeNode = Page & { children: TreeNode[] }

// Build a parent/child tree from a flat list of pages.
function buildTree(pages: Page[]): TreeNode[] {
  const byId = new Map<number, TreeNode>()
  pages.forEach((page) => byId.set(page.id, { ...page, children: [] }))

  const roots: TreeNode[] = []

  byId.forEach((node) => {
    const parent = node.parent
    const parentId =
      parent && typeof parent === 'object' ? parent.id : typeof parent === 'number' ? parent : null

    if (parentId != null && byId.has(parentId)) {
      byId.get(parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title))
    nodes.forEach((n) => sortNodes(n.children))
  }
  sortNodes(roots)

  return roots
}

function renderNodes(nodes: TreeNode[], depth: number, collectionSlug: string): React.ReactNode[] {
  return nodes.flatMap((node) => [
    <div
      key={node.id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        paddingLeft: 8 + depth * 24,
        borderBottom: '1px solid var(--theme-elevation-100)',
      }}
    >
      <span style={{ color: 'var(--theme-elevation-400)' }}>{depth > 0 ? '└─' : '•'}</span>
      <Link
        href={`/admin/collections/${collectionSlug}/${node.id}`}
        style={{ fontWeight: 500, textDecoration: 'none' }}
      >
        {node.title}
      </Link>
      <code style={{ color: 'var(--theme-elevation-500)', fontSize: '0.8em' }}>/{node.slug}</code>
      <span style={{ color: 'var(--theme-elevation-400)', fontSize: '0.75em' }}>
        order: {node.order ?? 0}
      </span>
      {node.status !== 'published' && (
        <span
          style={{
            fontSize: '0.7em',
            textTransform: 'uppercase',
            color: 'var(--theme-elevation-400)',
          }}
        >
          {node.status}
        </span>
      )}
    </div>,
    ...renderNodes(node.children, depth + 1, collectionSlug),
  ])
}

export default async function PagesHierarchyPanel(props: BeforeListServerProps) {
  const { payload, collectionConfig } = props
  const collectionSlug = collectionConfig?.slug ?? 'pages'

  const { docs: pages } = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1000,
    sort: 'order',
  })

  const tree = buildTree(pages as Page[])

  return (
    <div
      style={{
        marginBottom: 24,
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          fontWeight: 600,
          background: 'var(--theme-elevation-50)',
          borderBottom: '1px solid var(--theme-elevation-150)',
        }}
      >
        Page hierarchy
      </div>
      {tree.length === 0 ? (
        <div style={{ padding: 12, color: 'var(--theme-elevation-400)' }}>No pages yet.</div>
      ) : (
        <div>{renderNodes(tree, 0, collectionSlug)}</div>
      )}
    </div>
  )
}
