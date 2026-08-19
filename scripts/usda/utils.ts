import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

export function ensureDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

export async function downloadFile(url: string, destPath: string) {
  console.log(`Downloading ${url}`);
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }

  ensureDir(basename(destPath).includes(".") ? destPath.replace(/[/\\][^/\\]+$/, "") : destPath);
  const nodeStream = Readable.fromWeb(response.body as import("stream/web").ReadableStream);
  await pipeline(nodeStream, createWriteStream(destPath));
  console.log(`Saved ${destPath}`);
}

export function extractZip(zipPath: string, destDir: string) {
  ensureDir(destDir);
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(destDir, true);
  console.log(`Extracted ${zipPath} → ${destDir}`);
}

export function readCsv(filePath: string): Record<string, string>[] {
  const content = readFileSync(filePath, "utf8");
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  }) as Record<string, string>[];
}

export function findCsvFile(dir: string, filename: string): string {
  const direct = join(dir, filename);
  if (existsSync(direct)) {
    return direct;
  }

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      const nested = join(full, filename);
      if (existsSync(nested)) {
        return nested;
      }
    }
  }

  throw new Error(`Could not find ${filename} under ${dir}`);
}

export function parseArgs(argv: string[]) {
  const options = {
    datasets: ["foundation", "sr-legacy"] as string[],
    downloadOnly: false,
    limit: 0,
    dryRun: false,
    clean: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--datasets" && argv[i + 1]) {
      options.datasets = argv[i + 1].split(",").map((value) => value.trim());
      i += 1;
    } else if (arg === "--limit" && argv[i + 1]) {
      options.limit = Number(argv[i + 1]);
      i += 1;
    } else if (arg === "--download-only") {
      options.downloadOnly = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--clean") {
      options.clean = true;
    } else if (arg === "--all") {
      options.datasets = ["foundation", "sr-legacy", "fndds", "branded"];
    }
  }

  return options;
}

export function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

export function cleanDir(path: string) {
  if (existsSync(path)) {
    rmSync(path, { recursive: true, force: true });
  }
}
