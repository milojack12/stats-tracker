#!/usr/bin/env node
/**
 * Memory Visualizer
 * Parses memory/YYYY-MM-DD.md files and generates activity summaries
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(__dirname, '..', 'memory');

function parseDateFromFilename(filename) {
  const match = filename.match(/(\d{4})-(\d{2})-(\d{2})\.md$/);
  if (!match) return null;
  return new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
}

function extractSections(content) {
  const sections = {};
  let currentSection = null;
  let sectionContent = [];

  const lines = content.split('\n');
  for (const line of lines) {
    const headerMatch = line.match(/^##\s+(.+)$/);
    if (headerMatch) {
      if (currentSection) {
        sections[currentSection] = sectionContent.join('\n').trim();
      }
      currentSection = headerMatch[1].trim();
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }
  if (currentSection) {
    sections[currentSection] = sectionContent.join('\n').trim();
  }
  return sections;
}

function extractTasks(content) {
  const tasks = [];
  const lines = content.split('\n');
  for (const line of lines) {
    // Match "- **Label:** description" or "- **Label** description" pattern
    const taskMatch = line.match(/^\s*-\s+\*\*[^:]+:?\*\*\s*(.+)/) ||
                      // Match "- Fixed/Completed/Updated ..."  
                      line.match(/^\s*-\s+(?:Fixed|Completed|Updated|Resolved|Addressed|Created|Pushed|Submitted)\s+(.+)/i) ||
                      // Match bullet items with status symbols
                      line.match(/^\s*-\s+(?:✅|✓|☑|\[x\]|\[X\])\s*(.+)/) ||
                      // Match "Status: Task" format (e.g., "- Blocked: waiting for...")
                      line.match(/^\s*-\s+(?:Blocked|Waiting|Pending|In Progress|Done):\s*(.+)/i);
    if (taskMatch) {
      tasks.push(taskMatch[1].trim().substring(0, 80));
    }
  }
  return tasks;
}

function extractMentions(content) {
  const prs = content.match(/PR\s+#?\d+/gi) || [];
  const repos = content.match(/[\w-]+\/[\w-]+/g) || [];
  return { prs: [...new Set(prs)], repos: [...new Set(repos)] };
}

function loadMemoryFiles() {
  const files = fs.readdirSync(MEMORY_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  return files.map(filename => {
    const date = parseDateFromFilename(filename);
    const filepath = path.join(MEMORY_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    const sections = extractSections(content);
    const tasks = extractTasks(content);
    const mentions = extractMentions(content);

    return { filename, date, content, sections, tasks, mentions };
  });
}

function generateStats(entries) {
  const stats = {
    totalDays: entries.length,
    dateRange: entries.length ? {
      start: entries[0].date?.toISOString().split('T')[0],
      end: entries[entries.length - 1].date?.toISOString().split('T')[0]
    } : null,
    totalTasks: entries.reduce((sum, e) => sum + e.tasks.length, 0),
    allPRs: [...new Set(entries.flatMap(e => e.mentions.prs))],
    allRepos: [...new Set(entries.flatMap(e => e.mentions.repos))],
    sectionTypes: [...new Set(entries.flatMap(e => Object.keys(e.sections)))]
  };
  return stats;
}

function generateTimeline(entries, days = 7) {
  const recent = entries.slice(-days);
  return recent.map(e => ({
    date: e.date?.toISOString().split('T')[0],
    tasks: e.tasks,
    sections: Object.keys(e.sections)
  }));
}

function formatOutput(entries, stats) {
  const lines = [];
  lines.push('╔════════════════════════════════════════════════════════╗');
  lines.push('║           MEMORY VISUALIZER - ACTIVITY REPORT          ║');
  lines.push('╠════════════════════════════════════════════════════════╣');
  lines.push(`║ Sessions tracked: ${stats.totalDays.toString().padEnd(35)} ║`);
  lines.push(`║ Tasks logged:      ${stats.totalTasks.toString().padEnd(35)} ║`);
  if (stats.dateRange) {
    lines.push(`║ From: ${stats.dateRange.start.padEnd(49)} ║`);
    lines.push(`║ To:   ${stats.dateRange.end.padEnd(49)} ║`);
  }
  lines.push('╚════════════════════════════════════════════════════════╝');
  lines.push('');

  lines.push('📊 PULL REQUESTS MENTIONED:');
  stats.allPRs.forEach(pr => lines.push(`   • ${pr}`));
  lines.push('');

  lines.push('📦 REPOSITORIES:');
  stats.allRepos.forEach(repo => lines.push(`   • ${repo}`));
  lines.push('');

  lines.push('📅 RECENT ACTIVITY (last sessions):');
  const timeline = generateTimeline(entries, 3);
  timeline.forEach(day => {
    lines.push(`\n   ${day.date}:`);
    if (day.tasks.length) {
      day.tasks.slice(0, 5).forEach(task => lines.push(`      ✓ ${task.substring(0, 55)}`));
    } else {
      lines.push('      (no tasks logged)');
    }
  });
  lines.push('');

  return lines.join('\n');
}

function main() {
  try {
    const entries = loadMemoryFiles();
    if (entries.length === 0) {
      console.log('No memory files found in', MEMORY_DIR);
      return;
    }

    const stats = generateStats(entries);
    const output = formatOutput(entries, stats);
    console.log(output);

    // JSON export option
    if (process.argv.includes('--json')) {
      console.log('\n--- JSON ---');
      console.log(JSON.stringify({ stats, timeline: generateTimeline(entries, 7) }, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
