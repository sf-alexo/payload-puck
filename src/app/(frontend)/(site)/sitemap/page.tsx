import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import type { Page } from '@/payload-types'

export const dynamic = 'force-dynamic'

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

function TreeList({ nodes }: { nodes: TreeNode[] }) {
  if (nodes.length === 0) return null
  return (
    <ul style={{ listStyle: 'none', paddingLeft: 20, margin: '8px 0' }}>
      {nodes.map((node) => {
        const href = node.slug === 'home' ? '/' : `/${node.slug}`
        return (
          <li key={node.id} style={{ margin: '6px 0' }}>
            <Link
              href={href}
              style={{ color: '#1e293b', textDecoration: 'none', fontWeight: 500 }}
            >
              {node.title}
            </Link>
            {node.status !== 'published' && (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                }}
              >
                {node.status}
              </span>
            )}
            <TreeList nodes={node.children} />
          </li>
        )
      })}
    </ul>
  )
}

export default async function SitemapPage() {
  const payload = await getPayload({ config: await config })

  const { docs: pages } = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1000,
    sort: 'order',
  })

  const tree = buildTree(pages as Page[])

  return (
    <main
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '48px 24px',
        fontFamily: 'sans-serif',
        color: '#0b1120',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: 24 }}>Sitemap</h1>
      {tree.length === 0 ? (
        <p>No pages yet.</p>
      ) : (
        <TreeList nodes={tree} />
      )}
    </main>
  )
}
