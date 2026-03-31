#!/usr/bin/env node
/**
 * OpenClaw Stats Tracker
 * Analyzes session history and generates usage reports
 */

const fs = require('fs');
const path = require('path');

// Config
const MEMORY_DIR = path.join(process.cwd(), 'memory');
const MEMORY_FILE = path.join(process.cwd(), 'MEMORY.md');

// Stats object
const stats = {
  totalSessions: 0,
  totalMessages: 0,
  userMessages: 0,
  assistantMessages: 0,
  activeDays: new Set(),
  hourlyActivity: new Array(24).fill(0),
  dailyActivity: {},
  topics: {},
  earliestDate: null,
  latestDate: null,
  commandsUsed: {},
  prsMentioned: new Set(),
  reposMentioned: new Set()
};

// Parse a memory file
function parseMemoryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const basename = path.basename(filePath, '.md');
  const date = basename.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  
  if (date) {
    stats.activeDays.add(date);
    stats.dailyActivity[date] = (stats.dailyActivity[date] || 0) + 1;
    
    if (!stats.earliestDate || date < stats.earliestDate) stats.earliestDate = date;
    if (!stats.latestDate || date > stats.latestDate) stats.latestDate = date;
  }
  
  let sessionCount = 0;
  let messageCount = 0;
  
  for (const line of lines) {
    // Count sessions (marked by ## or ### headers with timestamps)
    if (line.match(/^#{2,3}\s+\d{4}-\d{2}-\d{2}/) || line.match(/^#{2,3}\s+Session/)) {
      sessionCount++;
      stats.totalSessions++;
    }
    
    // Count user messages (lines starting with "Jack:" or "User:")
    if (line.match(/^\s*[-*]?\s*(Jack|User)\s*:/i)) {
      messageCount++;
      stats.userMessages++;
      stats.totalMessages++;
    }
    
    // Count assistant messages (lines starting with "Milo:" or responses)
    if (line.match(/^\s*[-*]?\s*(Milo|Assistant)\s*:/i) || line.match(/^(Here|I\s+can|Let\s+me)/i)) {
      if (!line.match(/Jack:/i)) { // Avoid double counting
        stats.assistantMessages++;
        if (!stats.userMessages) stats.totalMessages++; // Rough estimate
      }
    }
    
    // Extract PR mentions
    const prMatches = line.match(/#\s*(\d{2,4})/g);
    if (prMatches) {
      prMatches.forEach(m => stats.prsMentioned.add(m.replace('#', '')));
    }
    
    // Extract repo mentions
    const repoMatches = line.match(/(jackmorrison12|milojack12)\/[\w-]+/g);
    if (repoMatches) {
      repoMatches.forEach(m => stats.reposMentioned.add(m));
    }
    
    // Track commands used (exec, gh, git)
    if (line.match(/^\s*>?\s*(exec|gh\s+|git\s+)/)) {
      const cmd = line.match(/(exec|gh|git)/)?.[0];
      stats.commandsUsed[cmd] = (stats.commandsUsed[cmd] || 0) + 1;
    }
  }
  
  return { date, sessionCount, messageCount };
}

// Parse MEMORY.md for long-term patterns
function parseMainMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return;
  
  const content = fs.readFileSync(MEMORY_FILE, 'utf-8');
  
  // Extract key topics/sections
  const sections = content.match(/^##\s+(.+)$/gm);
  if (sections) {
    sections.forEach(s => {
      const topic = s.replace(/^##\s+/, '').trim();
      stats.topics[topic] = (stats.topics[topic] || 0) + 1;
    });
  }
}

// Main analysis
function analyze() {
  console.log('📊 OpenClaw Stats Tracker\n');
  
  // Check if memory dir exists
  if (!fs.existsSync(MEMORY_DIR)) {
    console.log('⚠️  No memory/ directory found');
    return;
  }
  
  // Find all memory files
  const files = fs.readdirSync(MEMORY_DIR)
    .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .map(f => path.join(MEMORY_DIR, f))
    .sort();
  
  console.log(`Found ${files.length} daily memory files\n`);
  
  // Parse each file
  for (const file of files) {
    parseMemoryFile(file);
  }
  
  // Parse main memory
  parseMainMemory();
  
  // Calculate derived stats
  const daysActive = stats.activeDays.size;
  const totalDays = stats.earliestDate && stats.latestDate 
    ? Math.ceil((new Date(stats.latestDate) - new Date(stats.earliestDate)) / (1000 * 60 * 60 * 24)) + 1
    : 0;
  
  // Output report
  console.log('═══ Activity Summary ═══\n');
  console.log(`📅 Date Range:     ${stats.earliestDate || 'N/A'} → ${stats.latestDate || 'N/A'}`);
  console.log(`📊 Days Active:    ${daysActive} / ${totalDays} (${((daysActive / totalDays) * 100).toFixed(1)}%)`);
  console.log(`💬 Total Sessions: ~${stats.totalSessions}`);
  console.log(`💭 Est. Messages:  ~${stats.totalMessages} (User: ${stats.userMessages}, Assistant: ${stats.assistantMessages})`);
  console.log(`📦 PRs Tracked:    ${stats.prsMentioned.size}`);
  console.log(`📁 Repos Tracked:  ${stats.reposMentioned.size}`);
  
  console.log('\n═══ Commands Used ═══\n');
  const sortedCommands = Object.entries(stats.commandsUsed)
    .sort((a, b) => b[1] - a[1]);
  for (const [cmd, count] of sortedCommands.slice(0, 5)) {
    console.log(`  ${cmd}: ${count}`);
  }
  
  console.log('\n═══ Recent Activity ═══\n');
  const recentDays = Object.entries(stats.dailyActivity)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7);
  for (const [date, count] of recentDays) {
    const bar = '█'.repeat(Math.min(count, 20));
    console.log(`  ${date} ${bar} ${count}`);
  }
  
  console.log('\n═══ Recommendations ═══\n');
  if (daysActive > 0) {
    const avgDaily = (stats.totalMessages / daysActive).toFixed(1);
    console.log(`• Avg ${avgDaily} interactions/day`);
    console.log(`• Peak activity: ${Object.entries(stats.dailyActivity).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}`);
  }
  console.log(`• ${stats.prsMentioned.size} PRs require attention`);
  
  // Save stats to JSON for future use
  const outputFile = path.join(process.cwd(), 'memory', 'stats-summary.json');
  fs.writeFileSync(outputFile, JSON.stringify({
    generatedAt: new Date().toISOString(),
    summary: {
      daysActive,
      totalDays,
      totalSessions: stats.totalSessions,
      estimatedMessages: stats.totalMessages,
      userMessages: stats.userMessages,
      assistantMessages: stats.assistantMessages,
      dateRange: { start: stats.earliestDate, end: stats.latestDate }
    },
    dailyActivity: stats.dailyActivity,
    commandsUsed: stats.commandsUsed,
    prs: Array.from(stats.prsMentioned),
    repos: Array.from(stats.reposMentioned)
  }, null, 2));
  
  console.log(`\n✅ Stats saved to ${outputFile}`);
}

// Run
analyze();
