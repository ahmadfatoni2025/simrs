<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIMRSMB — Backend Schema & API</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { darkMode: 'class' };</script>
    <style>
        body { font-family: ui-sans-serif, system-ui, sans-serif; background: #0c0c10; }
        #canvas-wrap { touch-action: none; user-select: none; cursor: grab; }
        #canvas-wrap.panning { cursor: grabbing; }
        #world { position: absolute; inset: 0; transform-origin: 0 0; }
        .node {
            position: absolute; width: 250px; min-height: 40px;
            background: #16161c; border: 1px solid #26262e;
            border-radius: 0.6rem; overflow: visible; cursor: grab;
            box-shadow: 0 4px 14px rgba(0,0,0,.35);
        }
        .node.dragging { cursor: grabbing; border-color: #6355ff; box-shadow: 0 0 0 2px rgba(99,85,255,.35); }
        .node .head { display: flex; align-items: center; justify-content: space-between; background: #1c1c23; padding: 6px 10px; border-bottom: 1px solid #26262e; }
        .api-link { transition: all .15s ease; }
        .api-link:hover { border-color: #6355ff !important; color: #a5b4fc !important; }
        .zoom-btn:hover { background: #26262e; }
        .pole { position: absolute; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; border-radius: 9999px; pointer-events: none; }
        .pole.r { right: -3px; }
        .pole.l { left: -3px; }
    </style>
</head>
<body class="text-gray-200">
    <div class="max-w-6xl mx-auto px-5 py-10">

        <header class="mb-6 flex items-end justify-between flex-wrap gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-100">SIMRSMB — Backend</h1>
                <p class="text-sm text-gray-500 mt-1">Struktur database <span class="text-indigo-300">MySQL · simrsmb</span> — geser &amp; zoom kanvas, kabel menghubungkan tiap <span class="text-amber-300">FK</span> → <span class="text-emerald-300">PK</span></p>
            </div>
            <div class="flex items-center gap-2 text-xs">
                <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300">PK</span>
                <span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300">FK</span>
                <span class="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300">{{ count($tables) }} tabel</span>
            </div>
        </header>

        {{-- ============ ERD / SKEMA (pan & zoom) ============ --}}
        <section class="mb-10">
            <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest">Skema · Alur Kabel FK → PK</h2>
                <div class="flex items-center gap-2">
                    <button id="zoom-out" class="zoom-btn w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 text-gray-300 text-lg leading-none">−</button>
                    <span id="zoom-pct" class="text-xs text-gray-400 w-12 text-center">100%</span>
                    <button id="zoom-in" class="zoom-btn w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-700 text-gray-300 text-lg leading-none">+</button>
                    <button id="zoom-reset" class="zoom-btn h-8 px-3 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-gray-400">Reset</button>
                </div>
            </div>

            <div id="canvas-wrap" class="relative h-[70vh] border border-neutral-800 rounded-xl overflow-hidden bg-[#0d0d12]">
                <svg id="connector" class="absolute inset-0" style="pointer-events:none;"></svg>
                <div id="world">
                    @foreach ($tables as $table)
                        @php $slug = Str::slug($table['name']); @endphp
                        <div class="node" id="node-{{ $slug }}"
                             style="left: {{ $table['x'] * 15 }}px; top: {{ $table['y'] * 7 + 30 }}px;"
                             data-table="{{ $table['name'] }}">
                            <div class="head">
                                <span class="text-xs font-semibold text-indigo-300 font-mono truncate">{{ $table['name'] }}</span>
                                <span class="text-[9px] text-neutral-600">{{ count($table['cols']) }} kolom</span>
                            </div>
                            <div class="px-2 py-1.5">
                                @foreach ($table['cols'] as $col)
                                    @php
                                        $isPk = in_array($col, $table['pks'] ?? []);
                                        $isFk = array_key_exists($col, $table['fks'] ?? []);
                                    @endphp
                                    <div id="cell-{{ $slug }}-{{ $col }}"
                                         class="flex items-center gap-1.5 text-[10px] font-mono leading-[1.75] relative">
                                        <span class="{{ $isPk ? 'text-emerald-400' : ($isFk ? 'text-amber-400' : 'text-neutral-700') }}">{{ $isPk ? '◈' : ($isFk ? '◆' : '·') }}</span>
                                        <span class="{{ $isPk ? 'text-emerald-300 font-semibold' : ($isFk ? 'text-amber-300' : 'text-gray-400') }} truncate flex-1">{{ $col }}</span>
                                        @if ($isFk)
                                            <span class="text-[8px] text-neutral-500 truncate">{{ $table['fks'][$col] }}</span>
                                            <span class="pole r border border-amber-400 bg-amber-500/30"></span>
                                        @endif
                                        @if ($isPk)
                                            <span class="pole l border border-emerald-400 bg-emerald-500/30"></span>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- ============ RELASI / FOREIGN KEY ============ --}}
        <section class="mb-10">
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Relasi Foreign Key</h2>
            <div class="grid md:grid-cols-2 gap-3">
                @foreach ($tables as $table)
                    @foreach ($table['fks'] ?? [] as $col => $target)
                        <div class="flex items-center justify-between bg-[#16161c] border border-neutral-800 rounded-lg px-4 py-3 text-xs">
                            <span class="font-mono">
                                <span class="text-amber-300">{{ $table['name'] }}.{{ $col }}</span>
                                <span class="text-neutral-500 mx-2">━━▶</span>
                                <span class="text-emerald-300">{{ $target }}</span>
                            </span>
                            <span class="text-[9px] uppercase tracking-widest text-neutral-600">FOREIGN KEY</span>
                        </div>
                    @endforeach
                @endforeach
            </div>
        </section>

        {{-- ============ LINKS API ============ --}}
        <section>
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">API Endpoints</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                @foreach ($routes as $route)
                    @php
                        $color = match (true) {
                            str_contains($route['method'], 'GET') => 'text-emerald-400',
                            str_contains($route['method'], 'POST') => 'text-sky-400',
                            str_contains($route['method'], 'DELETE') => 'text-rose-400',
                            default => 'text-amber-400',
                        };
                    @endphp
                    <a href="{{ $route['uri'] }}" target="_blank"
                       class="api-link flex items-center gap-3 bg-[#16161c] border border-neutral-800 rounded-lg px-4 py-3">
                        <span class="text-[11px] font-mono font-bold w-12 {{ $color }}">{{ $route['method'] }}</span>
                        <span class="font-mono text-xs text-gray-300 truncate">{{ $route['uri'] }}</span>
                        <span class="ml-auto text-neutral-600">↗</span>
                    </a>
                @endforeach
            </div>
            <p class="text-xs text-neutral-500 mt-4">Setiap endpoint memerlukan header
                <code class="bg-neutral-900 px-1.5 py-0.5 rounded text-indigo-300">Authorization: Bearer &lt;token&gt;</code>
            </p>
        </section>
    </div>

    <script>
        const wrap = document.getElementById('canvas-wrap');
        const world = document.getElementById('world');
        const svg = document.getElementById('connector');
        const tableDefs = @json($tables);

        let view = { x: 34, y: 24, s: 0.72 };

        function applyTransform() {
            world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.s})`;
            document.getElementById('zoom-pct').textContent = Math.round(view.s * 100) + '%';
            draw();
        }

        const fks = [];
        for (const t of tableDefs) {
            for (const [col, target] of Object.entries(t.fks || {})) {
                const [tbl, colRef] = target.split('.');
                fks.push({ from: t.name, to: tbl, col, colRef });
            }
        }

function toWorld(el, side) {
            const r = el.getBoundingClientRect();
            const wr = wrap.getBoundingClientRect();
            if (!r.height) return null;
            // koordinat piksel KONTAINER (bukan divided scale) => kabel selalu menempel
            // dan otomatis mengikuti pan/zoom/drag node
            return {
                x: (side === 'r' ? r.right : r.left) - wr.left,
                y: r.top + r.height / 2 - wr.top,
            };
        }

        // slug dari nama tabel (sama seperti Str::slug keluaran blade)
        function slug(name) {
            return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        function draw() {
            const palette = ['#34d399', '#f59e0b', '#38bdf8', '#f472b6', '#a78bfa', '#22d3ee', '#4ade80'];
            let out = '';

            fks.forEach((rel, i) => {
                const srcCol = document.getElementById('cell-' + slug(rel.from) + '-' + rel.col);
                const dstCol = document.getElementById('cell-' + slug(rel.to) + '-' + rel.colRef);
                if (!srcCol || !dstCol) return;
                const a = toWorld(srcCol, 'r');
                const b = toWorld(dstCol, 'l');
                if (!a || !b) return;
                const stroke = palette[i % palette.length];

                // poros / terminal kecil
                out += `<circle cx="${a.x}" cy="${a.y}" r="3.2" fill="${stroke}"/>`;
                out += `<circle cx="${b.x}" cy="${b.y}" r="3.2" fill="${stroke}"/>`;

if (rel.from === rel.to) {
                    // self relation: loop dari poros FK ke atas lalu kembali ke kiri PK
                    const cx = a.x + 60, loopY = a.y - 46;
                    out += `<path d="M ${a.x} ${a.y} L ${a.x + 46} ${a.y} C ${a.x + 66} ${a.y}, ${a.x + 66} ${loopY}, ${a.x + 24} ${loopY} C ${a.x + 60} ${loopY}, ${b.x - 40} ${loopY}, ${b.x - 40} ${b.y} L ${b.x} ${b.y}"
                             fill="none" stroke="${stroke}" stroke-width="1.6" opacity=".8"/>`;
                    out += `<text x="${a.x + 60}" y="${loopY - 6}" text-anchor="middle" font-size="8.5" font-family="monospace" fill="#a5a8b8">${rel.col}</text>`;
                    return;
                }

                // kabel ortogonal: keluar kanan → turun/naik → masukkan kiri PK
                const stay = Math.min(a.x, b.x) - 34;
                const viaY = (a.y + b.y) / 2;
                const path = a.y < b.y
                    ? `M ${a.x} ${a.y} H ${stay} L ${stay} ${b.y} L ${b.x - 3} ${b.y}`
                    : `M ${a.x} ${a.y} H ${stay} L ${stay} ${b.y} L ${b.x - 3} ${b.y}`;
                out += `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="1.6" opacity=".85" stroke-linecap="round"/>`;

                // label di tengah jalur vertikal
                out += `<text x="${stay}" y="${(a.y + b.y) / 2 + 3}" text-anchor="end" font-size="8.5"
                          font-family="monospace" fill="#8a8aa0">${rel.from}.${rel.col} → ${rel.to}.${rel.colRef}</text>`;
            });

            svg.setAttribute('viewBox', '0 0 ' + wrap.clientWidth + ' ' + wrap.clientHeight);
            svg.setAttribute('width', wrap.clientWidth + 'px');
            svg.setAttribute('height', wrap.clientHeight + 'px');
            svg.innerHTML = out;
        }

        // ---- pan & zoom ----
        let drag = null;
        wrap.addEventListener('pointerdown', (e) => {
            const target = e.target.closest('.node');
            if (target) {
                drag = { node: target, sx: e.clientX, sy: e.clientY, ox: target.offsetLeft, oy: target.offsetTop };
            } else {
                drag = { x: view.x - e.clientX, y: view.y - e.clientY };
            }
            wrap.setPointerCapture(e.pointerId);
            if (drag.node) target.classList.add('dragging'); else wrap.classList.add('panning');
        });
        wrap.addEventListener('pointermove', (e) => {
            if (!drag) return;
            if (drag.node) {
                drag.node.style.left = (drag.ox + (e.clientX - drag.sx) / view.s) + 'px';
                drag.node.style.top = (drag.oy + (e.clientY - drag.sy) / view.s) + 'px';
                draw();
            } else {
                view.x = drag.x + e.clientX;
                view.y = drag.y + e.clientY;
                applyTransform();
            }
        });
        const endDrag = () => {
            if (drag) { if (drag.node) drag.node.classList.remove('dragging'); wrap.classList.remove('panning'); }
            drag = null;
        };
        wrap.addEventListener('pointerup', endDrag);
        wrap.addEventListener('pointercancel', endDrag);

        wrap.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = wrap.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            const factor = Math.pow(1.0018, -e.deltaY);
            const ns = Math.min(2.5, Math.max(0.3, view.s * factor));
            const k = ns / view.s;
            view.x = mx - (mx - view.x) * k;
            view.y = my - (my - view.y) * k;
            view.s = ns;
            applyTransform();
        }, { passive: false });

        function zoomBy(f) {
            const rect = wrap.getBoundingClientRect();
            const mx = rect.width / 2, my = rect.height / 2;
            const ns = Math.min(2.5, Math.max(0.3, view.s * f));
            const k = ns / view.s;
            view.x = mx - (mx - view.x) * k;
            view.y = my - (my - view.y) * k;
            view.s = ns;
            applyTransform();
        }
        document.getElementById('zoom-in').addEventListener('click', () => zoomBy(1.25));
        document.getElementById('zoom-out').addEventListener('click', () => zoomBy(0.8));
        document.getElementById('zoom-reset').addEventListener('click', () => {
            view = { x: 34, y: 24, s: 0.72 };
            applyTransform();
        });

        window.addEventListener('resize', draw);
        applyTransform();
    </script>
</body>
</html>