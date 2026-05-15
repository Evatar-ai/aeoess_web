#!/usr/bin/env node
// Pre-render the var UPDATES array into the static <aside data-updates-panel>
// block inside opensource.html, between BUILD:UPDATES_START / BUILD:UPDATES_END.
//
// Why this exists: the daily flow edits the var UPDATES array (newest on top).
// The baked static block is what non-JS visitors, screen readers, and crawlers
// actually see. Without this step the array drifts ahead of the baked block
// and the panel renders stale. This script regenerates the baked block from
// the array so the two always match. sync-updates-panel.py invokes it as
// step 0, then propagates both array and block to peer pages.
//
// Zero dependencies. Run via: node scripts/build-updates-panel.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const htmlPath = join(root, 'opensource.html')

const START = '<!-- BUILD:UPDATES_START -->'
const END = '<!-- BUILD:UPDATES_END -->'

// Kinds that render with the brighter label color (rest use the dim color).
const BRIGHT_KINDS = new Set(['convergence', 'research'])

function escape(value) {
  if (value === undefined || value === null) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function extractUpdates(html) {
  const m = html.match(/var UPDATES = (\[\{[\s\S]*?\}\]);/)
  if (!m) throw new Error('build-updates-panel: var UPDATES array not found in opensource.html')
  // The array is a plain JS literal: a list of objects with string fields.
  // Evaluate it in an isolated function scope with no access to closure state.
  let arr
  try {
    arr = Function(`"use strict"; return (${m[1]});`)()
  } catch (e) {
    throw new Error('build-updates-panel: var UPDATES did not parse as JS: ' + e.message)
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('build-updates-panel: var UPDATES parsed empty or not an array')
  }
  return arr
}

function renderEntry(u, isFirst) {
  const border = isFirst ? 'none' : '1px solid rgb(46, 46, 50)'
  const kindColor = BRIGHT_KINDS.has(u.kind) ? 'rgb(236, 236, 236)' : 'rgb(138, 138, 142)'
  const link = u.href
    ? ` \u00b7 <a href="${escape(u.href)}" style="color: rgb(124, 172, 222); text-decoration: none;">${escape(u.hrefLabel || 'link')} \u2192</a>`
    : ''
  return (
    `<div style="padding: 12px 18px; border-top: ${border};">` +
      `<div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px;">` +
        `<span style="font-size: 11px; color: rgb(90, 90, 94); font-family: ui-monospace, SFMono-Regular, &quot;JetBrains Mono&quot;, Menlo, monospace; min-width: 36px;">${escape(u.date)}</span>` +
        `<span style="font-size: 10px; color: ${kindColor}; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700;">${escape(u.kind)}</span>` +
      `</div>` +
      `<div style="font-size: 12.5px; font-weight: 600; color: rgb(236, 236, 236); line-height: 1.4;">${escape(u.title)}</div>` +
      `<div style="font-size: 11.5px; color: rgb(138, 138, 142); line-height: 1.5; margin-top: 4px;">${escape(u.body)}${link}</div>` +
    `</div>`
  )
}

function renderPanel(updates) {
  const entries = updates.map((u, i) => renderEntry(u, i === 0)).join('')
  return (
    `\n<aside data-updates-panel="" style="position: sticky; top: 90px; border: 1px solid rgb(46, 46, 50); border-radius: 6px; background: rgb(36, 36, 38); max-height: calc(-110px + 100vh); display: flex; flex-direction: column; overflow: hidden;">` +
      `<div style="padding: 14px 18px; border-bottom: 1px solid rgb(46, 46, 50); display: flex; align-items: center; justify-content: space-between;">` +
        `<div style="font-size: 13px; font-weight: 600; color: rgb(236, 236, 236);">Updates</div>` +
        `<a href="/blog" style="font-size: 11.5px; color: rgb(124, 172, 222); text-decoration: none;">Full log \u2192</a>` +
      `</div>` +
      `<div style="overflow-y: auto; flex: 1 1 0%;">` +
        entries +
      `</div>` +
    `</aside>\n`
  )
}

function build() {
  const html = readFileSync(htmlPath, 'utf8')
  const startIdx = html.indexOf(START)
  const endIdx = html.indexOf(END)
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`build-updates-panel: markers ${START} / ${END} not found in opensource.html`)
  }
  if (endIdx < startIdx) {
    throw new Error('build-updates-panel: marker order reversed in opensource.html')
  }
  const updates = extractUpdates(html)
  const generated = renderPanel(updates)
  const before = html.slice(0, startIdx + START.length)
  const after = html.slice(endIdx)
  writeFileSync(htmlPath, before + generated + after, 'utf8')
  process.stdout.write(`build-updates-panel: rendered ${updates.length} entries into opensource.html\n`)
}

build()
