#!/usr/bin/env node
/**
 * Screen Time Integration Helper
 * Assists with extracting macOS Screen Time data for the Wrapped page
 * 
 * NOTE: Screen Time data is protected by macOS and requires manual export
 * or user-approved Shortcuts automation. Direct API access is restricted.
 */

const fs = require('fs');
const path = require('path');

// Instructions for manual export
function showExportInstructions() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║       macOS Screen Time Export Instructions                  ║
╠══════════════════════════════════════════════════════════════╣
║ 1. Open System Settings → Screen Time                       ║
║ 2. Click "App Usage" or "Device Usage"                       ║
║ 3. Click the Share button (top-right corner)                 ║
║ 4. Select "Export Data" or "Save to Files"                   ║
║ 5. Save to Downloads/Desktop as JSON/CSV                   ║
╠══════════════════════════════════════════════════════════════╣
║ Alternative: Use Shortcuts App                               ║
║ • Create a shortcut that exports Screen Time weekly          ║
║ • Can be automated to run on schedule                        ║
╚══════════════════════════════════════════════════════════════╝
`);
}

// Parse exported Screen Time data
function parseScreenTimeData(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.json') {
    return JSON.parse(content);
  } else if (ext === '.csv') {
    // Basic CSV parsing
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i]);
      return obj;
    });
  }
  
  return null;
}

// Generate summary stats
function generateSummary(data) {
  const appUsage = {};
  let totalMinutes = 0;
  
  data.forEach(entry => {
    const app = entry.app || entry['App Name'] || 'Unknown';
    const minutes = parseInt(entry.minutes || entry['Minutes'] || 0);
    
    appUsage[app] = (appUsage[app] || 0) + minutes;
    totalMinutes += minutes;
  });
  
  // Sort by usage
  const sortedApps = Object.entries(appUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return {
    totalMinutes,
    totalHours: (totalMinutes / 60).toFixed(1),
    topApps: sortedApps,
    categories: {}
  };
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('📱 Screen Time Integration Helper\n');
  
  if (command === 'help' || !command) {
    showExportInstructions();
    console.log('Usage:');
    console.log('  node screen-time-helper.js parse <file> - Parse exported data');
    console.log('  node screen-time-helper.js template   - Generate template for manual entry');
    return;
  }
  
  if (command === 'parse') {
    const filePath = args[1];
    if (!filePath || !fs.existsSync(filePath)) {
      console.log('❌ Please provide a valid file path');
      return;
    }
    
    try {
      const data = parseScreenTimeData(filePath);
      const summary = generateSummary(data);
      
      console.log('═══ Screen Time Summary ═══\n');
      console.log(`Total: ${summary.totalHours} hours\n`);
      console.log('Top Apps:');
      summary.topApps.forEach(([app, mins], i) => {
        console.log(`  ${i + 1}. ${app}: ${(mins / 60).toFixed(1)}h`);
      });
      
      const outFile = path.join(process.cwd(), 'memory', 'screen-time-summary.json');
      fs.writeFileSync(outFile, JSON.stringify({
        generatedAt: new Date().toISOString(),
        sourceFile: filePath,
        summary
      }, null, 2));
      
      console.log(`\n💾 Saved to ${outFile}`);
    } catch (e) {
      console.log(`❌ Error parsing file: ${e.message}`);
    }
    return;
  }
  
  if (command === 'template') {
    const template = {
      weekOf: '2026-03-24',
      totalHours: 0,
      categories: { productivity: 0, entertainment: 0, social: 0, other: 0 },
      topApps: []
    };
    
    const outFile = path.join(process.cwd(), 'memory', 'screen-time-manual.json');
    fs.writeFileSync(outFile, JSON.stringify(template, null, 2));
    
    console.log('✅ Created template file:');
    console.log(`  ${outFile}`);
    console.log('\nEdit this file with your Screen Time data from:');
    console.log('  System Settings → Screen Time');
  }
}

module.exports = { showExportInstructions, parseScreenTimeData, generateSummary };

if (require.main === module) main();
