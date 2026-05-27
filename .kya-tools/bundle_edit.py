#!/usr/bin/env python3
import sys, re, json, gzip, base64, hashlib, io

# Literal sequences we need to emit in the output FILE (not interpreted)
ESC_SCRIPT_CLOSE = r'<\u002Fscript'  # 13 chars; replaces </script in JSON payload
ESC_STYLE_CLOSE  = r'<\u002Fstyle'

def parse_file(path):
    with open(path) as f: s = f.read()
    scripts = []
    for m in re.finditer(r'<script[^>]*>(.*?)</script>', s, re.DOTALL):
        scripts.append({'start': m.start(), 'end': m.end(), 'body': m.group(1)})
    return s, scripts

def decode_bundle(s1_body):
    body = s1_body.strip()
    start = body.find('{"')
    return json.loads(body[start:]), body[:start]

def encode_bundle(prefix, bundle_dict):
    # Bundle JSON does not contain </script> literally (keys are uuids, values are base64), no escaping needed.
    return prefix + json.dumps(bundle_dict, separators=(',', ':'))

def decode_resource(meta):
    data = base64.b64decode(meta['data'])
    if meta.get('compressed'): data = gzip.decompress(data)
    return data.decode('utf-8', errors='replace')

def encode_resource(text, compressed=True):
    raw = text.encode('utf-8')
    # SRI computed against the DECOMPRESSED source bytes
    sri = 'sha384-' + base64.b64encode(hashlib.sha384(raw).digest()).decode('ascii')
    if compressed:
        buf = io.BytesIO()
        with gzip.GzipFile(fileobj=buf, mode='wb', mtime=0, compresslevel=9) as g:
            g.write(raw)
        data = buf.getvalue()
    else:
        data = raw
    return base64.b64encode(data).decode('ascii'), sri

def find_inner_html(scripts):
    return json.loads(scripts[3]['body'].strip())

def write_inner_html(scripts, html_str):
    # JSON-encode the HTML string; then escape any </script or </style that would close the wrapping <script>.
    payload = json.dumps(html_str)
    # In the FILE we want literal backslash + u002F + script (so JSON-decoder sees \u002Fscript = /script)
    # In Python source ESC_SCRIPT_CLOSE = '<\u002Fscript' is the 13-char target.
    payload = payload.replace('</script', ESC_SCRIPT_CLOSE).replace('</style', ESC_STYLE_CLOSE)
    scripts[3]['body'] = '\n ' + payload + '\n  '

def update_integrity_in_inner(inner_html, uuid, new_sri):
    pattern = rf'(src="{re.escape(uuid)}"\s+integrity=")[^"\\]+(")'
    return re.sub(pattern, rf'\g<1>{new_sri}\g<2>', inner_html)

def reassemble(s, scripts):
    out = s
    for sc in sorted(scripts, key=lambda x: -x['start']):
        body_start = s.index('>', sc['start']) + 1
        body_end = s.index('</script>', body_start)
        out = out[:body_start] + sc['body'] + out[body_end:]
    return out

def cmd_list(path):
    _, scripts = parse_file(path)
    bundle, _ = decode_bundle(scripts[1]['body'])
    for uuid, meta in bundle.items():
        try:
            src = decode_resource(meta)
            head = src.replace(chr(10), ' ')[:120]
            print(f'{uuid}  {meta.get("mime",""):24}  {len(src):>7}c  {head[:100]}')
        except Exception as e:
            print(f'{uuid}  (decode err: {e})')

def cmd_show(path, uuid):
    _, scripts = parse_file(path)
    bundle, _ = decode_bundle(scripts[1]['body'])
    print(decode_resource(bundle[uuid]))

def cmd_check_integrity(path):
    _, scripts = parse_file(path)
    bundle, _ = decode_bundle(scripts[1]['body'])
    inner = find_inner_html(scripts)
    pattern = re.compile(r'src="([a-f0-9-]{36})"\s+integrity="([^"]+)"')
    ok = bad = 0
    for m in pattern.finditer(inner):
        uuid, declared = m.group(1), m.group(2)
        if uuid not in bundle:
            print(f'  {uuid}: not in bundle'); bad += 1; continue
        meta = bundle[uuid]
        raw = base64.b64decode(meta['data'])
        decompressed = gzip.decompress(raw) if meta.get('compressed') else raw
        actual = 'sha384-' + base64.b64encode(hashlib.sha384(decompressed).digest()).decode('ascii')
        if declared == actual: ok += 1
        else:
            print(f'  {uuid}: MISMATCH'); bad += 1
    print(f'integrity: {ok} ok, {bad} bad')
    return bad == 0

def cmd_replace_global(path, old, new, dry_run=False):
    s, scripts = parse_file(path)
    bundle, prefix = decode_bundle(scripts[1]['body'])
    inner = find_inner_html(scripts)
    total = 0
    changed = []
    for uuid, meta in bundle.items():
        try: src = decode_resource(meta)
        except: continue
        if old not in src: continue
        hits = src.count(old); total += hits
        new_src = src.replace(old, new)
        new_b64, new_sri = encode_resource(new_src, meta.get('compressed', True))
        if dry_run:
            print(f'  {uuid}: {hits} hits'); continue
        bundle[uuid]['data'] = new_b64
        inner = update_integrity_in_inner(inner, uuid, new_sri)
        changed.append(uuid)
    if dry_run:
        print(f'DRY RUN: {total} hits across {len(changed)} resources'); return
    if total == 0:
        print(f'no matches for: {repr(old)[:80]}'); return
    scripts[1]['body'] = encode_bundle(prefix, bundle)
    write_inner_html(scripts, inner)
    out = reassemble(s, scripts)
    with open(path, 'w') as f: f.write(out)
    print(f'OK: {total} replacements across {len(changed)} resources')

def cmd_replace_meta(path, key, value):
    s, scripts = parse_file(path)
    inner = find_inner_html(scripts)
    pattern_name = rf'(<meta\s+name="{re.escape(key)}"\s+content=")[^"]*(")'
    pattern_prop = rf'(<meta\s+property="{re.escape(key)}"\s+content=")[^"]*(")'
    if re.search(pattern_name, inner):
        inner = re.sub(pattern_name, rf'\g<1>{value}\g<2>', inner)
    elif re.search(pattern_prop, inner):
        inner = re.sub(pattern_prop, rf'\g<1>{value}\g<2>', inner)
    else:
        attr = 'property' if key.startswith(('og:', 'twitter:', 'article:')) else 'name'
        tag = f'<meta {attr}="{key}" content="{value}">'
        inner = inner.replace('</head>', f'  {tag}\n</head>', 1)
    write_inner_html(scripts, inner)
    with open(path, 'w') as f: f.write(reassemble(s, scripts))
    print(f'meta {key} -> {value}')

def cmd_replace_title(path, new_title):
    s, scripts = parse_file(path)
    inner = find_inner_html(scripts)
    inner = re.sub(r'<title>[^<]*</title>', f'<title>{new_title}</title>', inner, count=1)
    write_inner_html(scripts, inner)
    with open(path, 'w') as f: f.write(reassemble(s, scripts))
    print(f'title -> {new_title}')

def cmd_inject_head(path, snippet):
    # Inject raw HTML snippet before </head>. Snippet must already be valid HTML.
    s, scripts = parse_file(path)
    inner = find_inner_html(scripts)
    inner = inner.replace('</head>', snippet + '\n</head>', 1)
    write_inner_html(scripts, inner)
    with open(path, 'w') as f: f.write(reassemble(s, scripts))
    print('injected into <head>')

def cmd_inject_body_end(path, snippet):
    # Inject raw HTML/JS snippet before </body> of the INNER document.
    s, scripts = parse_file(path)
    inner = find_inner_html(scripts)
    inner = inner.replace('</body>', snippet + '\n</body>', 1)
    write_inner_html(scripts, inner)
    with open(path, 'w') as f: f.write(reassemble(s, scripts))
    print('injected before inner </body>')

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'LIST_RESOURCES': cmd_list(sys.argv[2])
    elif cmd == 'SHOW': cmd_show(sys.argv[2], sys.argv[3])
    elif cmd == 'CHECK_INTEGRITY': sys.exit(0 if cmd_check_integrity(sys.argv[2]) else 1)
    elif cmd == 'REPLACE_GLOBAL': cmd_replace_global(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == 'REPLACE_GLOBAL_DRY': cmd_replace_global(sys.argv[2], sys.argv[3], sys.argv[4], dry_run=True)
    elif cmd == 'REPLACE_META': cmd_replace_meta(sys.argv[2], sys.argv[3], sys.argv[4])
    elif cmd == 'REPLACE_TITLE': cmd_replace_title(sys.argv[2], sys.argv[3])
    elif cmd == 'INJECT_HEAD': cmd_inject_head(sys.argv[2], sys.argv[3])
    elif cmd == 'INJECT_BODY_END': cmd_inject_body_end(sys.argv[2], sys.argv[3])
    else: print('unknown:', cmd); sys.exit(1)
