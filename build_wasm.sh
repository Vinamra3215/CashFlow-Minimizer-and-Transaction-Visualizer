#!/bin/bash
# Build C++ algorithms to WebAssembly
# Requires: Emscripten SDK (emsdk) installed in ./emsdk/

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
EMSDK_DIR="$SCRIPT_DIR/emsdk"

# Activate Emscripten
source "$EMSDK_DIR/emsdk_env.sh" 2>/dev/null

echo "=== Compiling C++ algorithms to WebAssembly ==="

emcc src/wasm/algorithms.cpp \
  -o public/algorithms.js \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="AlgorithmsModule" \
  -s EXPORTED_FUNCTIONS='["_run_greedy","_run_heap_based","_run_sorting","_run_min_cashflow","_run_priority_queue","_malloc","_free"]' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s ENVIRONMENT='worker' \
  -O2

echo "=== Build complete ==="
echo "Output: public/algorithms.js + public/algorithms.wasm"
