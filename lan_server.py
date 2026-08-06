#!/usr/bin/env python3
"""Serve only the public portfolio page to the local network."""

from __future__ import annotations

import argparse
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


class PortfolioServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(
        self,
        address: tuple[str, int],
        index_html: bytes,
        public_assets: dict[str, tuple[bytes, str]],
    ) -> None:
        super().__init__(address, PortfolioHandler)
        self.index_html = index_html
        self.public_assets = public_assets


class PortfolioHandler(BaseHTTPRequestHandler):
    server: PortfolioServer

    def _send_headers(self, status: int, content_type: str, length: int) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(length))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.end_headers()

    def _respond(self, *, include_body: bool) -> None:
        path = urlsplit(self.path).path
        if path in {"/", "/index.html"}:
            payload = self.server.index_html
            content_type = "text/html; charset=utf-8"
            status = 200
        elif path in self.server.public_assets:
            payload, content_type = self.server.public_assets[path]
            status = 200
        elif path == "/health":
            payload = json.dumps({"status": "ok"}).encode("utf-8")
            content_type = "application/json; charset=utf-8"
            status = 200
        else:
            payload = b"Not Found"
            content_type = "text/plain; charset=utf-8"
            status = 404

        self._send_headers(status, content_type, len(payload))
        if include_body:
            self.wfile.write(payload)

    def do_GET(self) -> None:  # noqa: N802
        self._respond(include_body=True)

    def do_HEAD(self) -> None:  # noqa: N802
        self._respond(include_body=False)

    def _method_not_allowed(self) -> None:
        payload = b"Method Not Allowed"
        self.send_response(405)
        self.send_header("Allow", "GET, HEAD")
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(payload)

    do_POST = _method_not_allowed
    do_PUT = _method_not_allowed
    do_PATCH = _method_not_allowed
    do_DELETE = _method_not_allowed

    def log_message(self, format: str, *args: object) -> None:
        print(f"{self.client_address[0]} - {format % args}", flush=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the portfolio page on a local network.")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=4178)
    parser.add_argument("--index", type=Path, default=Path(__file__).with_name("index.html"))
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    index_path = args.index.resolve()
    index_html = index_path.read_bytes()
    dashboard_image = index_path.with_name("rfm-original-desensitized-v2.png")
    operating_notes = index_path.with_name("assets") / "operating-notes.js"
    industry_notes = index_path.with_name("assets") / "industry-notes.js"
    note_methodology = index_path.with_name("assets") / "note-methodology.js"
    profile_photo = index_path.with_name("assets") / "du-huazhao-profile-2026.png"
    brand_logo_dir = index_path.with_name("assets") / "brand-logos"
    operations_dashboard_dir = index_path.with_name("assets") / "operations-dashboard"
    public_assets = {
        "/rfm-original-desensitized-v2.png": (dashboard_image.read_bytes(), "image/png"),
        "/assets/operating-notes.js": (
            operating_notes.read_bytes(),
            "text/javascript; charset=utf-8",
        ),
        "/assets/industry-notes.js": (
            industry_notes.read_bytes(),
            "text/javascript; charset=utf-8",
        ),
        "/assets/note-methodology.js": (
            note_methodology.read_bytes(),
            "text/javascript; charset=utf-8",
        ),
        "/assets/du-huazhao-profile-2026.png": (
            profile_photo.read_bytes(),
            "image/png",
        ),
        "/assets/brand-logos/by-health.png": (
            (brand_logo_dir / "by-health.png").read_bytes(),
            "image/png",
        ),
        "/assets/brand-logos/mead-johnson.png": (
            (brand_logo_dir / "mead-johnson.png").read_bytes(),
            "image/png",
        ),
        "/assets/brand-logos/suibao-icon.png": (
            (brand_logo_dir / "suibao-icon.png").read_bytes(),
            "image/png",
        ),
        "/assets/brand-logos/enchanteur.svg": (
            (brand_logo_dir / "enchanteur.svg").read_bytes(),
            "image/svg+xml; charset=utf-8",
        ),
        "/assets/operations-dashboard/index.html": (
            (operations_dashboard_dir / "index.html").read_bytes(),
            "text/html; charset=utf-8",
        ),
        "/assets/operations-dashboard/preview-ai-demo.png": (
            (operations_dashboard_dir / "preview-ai-demo.png").read_bytes(),
            "image/png",
        ),
        "/assets/operations-dashboard/jd_dashboard_api.js": (
            (operations_dashboard_dir / "jd_dashboard_api.js").read_bytes(),
            "text/javascript; charset=utf-8",
        ),
        "/assets/operations-dashboard/jd_promotion_demo.js": (
            (operations_dashboard_dir / "jd_promotion_demo.js").read_bytes(),
            "text/javascript; charset=utf-8",
        ),
        "/assets/operations-dashboard/jd_aftersale_dashboard.js": (
            (operations_dashboard_dir / "jd_aftersale_dashboard.js").read_bytes(),
            "text/javascript; charset=utf-8",
        ),
        "/assets/operations-dashboard/dashboard-demo.json": (
            (operations_dashboard_dir / "dashboard-demo.json").read_bytes(),
            "application/json; charset=utf-8",
        ),
    }
    server = PortfolioServer((args.host, args.port), index_html, public_assets)
    print(f"Portfolio available on http://{args.host}:{args.port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
