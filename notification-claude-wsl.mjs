#! /usr/bin/env node

import { exec } from "node:child_process";
import { promisify } from 'node:util';
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const execAsync = promisify(exec);

try {
  const input = JSON.parse(readFileSync(process.stdin.fd, 'utf8'));
  if (!input.transcript_path) {
    process.exit(0);
  }

  const homeDir = os.homedir();
  let transcriptPath = input.transcript_path;

  if (transcriptPath.startsWith('~/')) {
    transcriptPath = path.join(homeDir, transcriptPath.slice(2));
  }

  const allowedBase = path.join(homeDir, '.claude', 'projects');
  const resolvedPath = path.resolve(transcriptPath);

  if (!resolvedPath.startsWith(allowedBase)) {
    process.exit(1);
  }

  if (!existsSync(resolvedPath)) {
    console.log('Hook execution failed: Transcript file does not exist');
    process.exit(0);
  }

  const lines = readFileSync(resolvedPath, "utf-8").split("\n").filter(line => line.trim());
  if (lines.length === 0) {
    console.log('Hook execution failed: Transcript file is empty');
    process.exit(0);
  }

  const lastLine = lines[lines.length - 1];
  const transcript = JSON.parse(lastLine);
  const lastMessageContent = transcript?.message?.content?.[0]?.text;

  if (lastMessageContent) {
    const command = `powershell.exe -ExecutionPolicy RemoteSigned -Command "New-BurntToastNotification -Header (New-BTHeader -Id 'news' -Title 'Claude Code') -Text '${lastMessageContent}'"`;
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error('PowerShell error:', stderr);
    } else {
      console.log('Notification sent:', stdout);
    }
  }
} catch (error) {
  console.log('Hook execution failed:', error.message);
  process.exit(1);
}
