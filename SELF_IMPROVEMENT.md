# SELF_IMPROVEMENT.md - Learning & Projects

> When there's nothing to do, make something worth doing.

## Purpose

This file tracks ongoing self-improvement projects. These are:
- Side projects that make me better at my job
- Learning experiments (new tech, techniques)
- Tools/utilities that help me work
- Documentation of patterns and lessons

## Current Session Format

When entering self-improvement mode:
```yaml
session_id: YYYY-MM-DD-N
start_time: ISO timestamp
focus_area: what I'm working on
time_budget: how long to spend
planned_outcome: what I'll produce
update_method: message | email | batched
```

## Active Sessions
*(none currently)*

## Completed Sessions

### session-005: Memory Visualizer ✅
- **focus_area**: CLI tool to parse memory/YYYY-MM-DD.md files and generate activity summaries/timelines
- **time_budget**: ~45 minutes
- **actual_time**: ~35 minutes
- **delivered**: `scripts/memory-viewer.js` - parses dates, extracts tasks, PRs, repos; outputs formatted reports with stats and timeline
- **update_method**: batched
- **started**: 2026-03-08T19:46:00Z
- **completed**: 2026-03-08T20:51:00Z
- **notes**: Created executable Node.js script. Parses 3 memory files, extracted 10 tasks, identified PRs #71, #73, #74, #75. Supports --json flag for JSON export.

### session-004: GitHub Skill Documentation ✅
- **focus_area**: Create quick-reference doc for GitHub CLI patterns used in PR workflows
- **time_budget**: ~45 minutes
- **actual_time**: ~15 minutes
- **delivered**: `docs/github-skill.md` with commands, jq filters, common patterns
- **update_method**: batched
- **started**: 2026-03-07T20:40:00Z
- **completed**: 2026-03-07T20:55:00Z

### session-003: Fix Social Icon Hover Effects 🛠️
- **focus_area**: Fix PR #73 where social icons weren't rendering after AnimatedIcon component changes
- **time_budget**: ~45 minutes
- **actual_time**: ~30 minutes
- **delivered**: Fixed by reverting to CSS-only hover effects, removing problematic client component
- **update_method**: immediate → sent Telegram message
- **started**: 2026-02-27T19:28:00Z
- **completed**: 2026-02-27T20:58:00Z
- **notes**: Root cause was AnimatedIcon component with useState/useEffect causing issues with SVG rendering in React. Simplified to pure CSS: platform-specific colors (twitter, linkedin, github, instagram classes), scale/rotate transforms, drop-shadow glow effects. Push fix to PR #73.

### session-002: TIL Bot 🎉
- **focus_area**: Build a tool that extracts lessons/patterns from memory files
- **time_budget**: ~1 hour
- **actual_time**: ~45 minutes
- **delivered**: Working TIL bot with categories (tech patterns, mistakes, decisions, wins)
- **update_method**: milestone → sent via email
- **started**: 2026-02-18T15:00:00Z
- **completed**: 2026-02-18T16:55:00Z
- **repo**: https://github.com/milojack12/til-bot
- **notes**: Extracts patterns from memory files. Generates stats + categorized output.

**→ Send milestone email IMMEDIATELY on completion, not during heartbeat.**

### session-001: Email Sender Script ✅
- **focus_area**: Create SMTP email sending script for milestone-based updates
- **time_budget**: ~30 minutes
- **actual_time**: ~15 minutes
- **delivered**: Working `scripts/send-email.js` + test email sent to Jack
- **update_method**: milestone → sent via email
- **started**: 2026-02-18T14:40:00Z
- **completed**: 2026-02-18T14:55:00Z
- **notes**: SMTP via TLS on port 465. Uses AUTH LOGIN with base64 encoding. Tested successfully.

## Project Ideas Backlog

### Easter Eggs for Jack's Site 🥚
Fun hidden features in jackmorrison.xyz

- [x] **#2: Konami Code Easter Egg** ✅ PR #74
  - Detect ↑↑↓↓←→←→BA sequence
  - Trigger fun animation/message (maybe confetti + "You found the secret!")
  - ~30 min task

- [x] **#4: Social Icon Hover Effects** ✅ PR #73
  - Subtle animations on social icons in footer
  - Ideas: color change, rotate, bounce, glow
  - ~20 min task

- [x] **#5: Hidden Terminal** ✅ PR #75
  - Press ` key to open mini CLI overlay
  - Commands: help, whoami, projects, secret
  - ~2 hour task (bigger project)
  - Break into: terminal component, command parser, easter egg responses

### Other Projects

- [ ] **Code Review Helper**
  - CLI tool to check PRs for common issues before human review

- [ ] **Memory Visualizer**
  - Parse memory files and build a timeline of what I've learned

- [ ] **Jack's Dashboard**
  - Single-page view of all his projects/status (with your permission)

- [ ] **GitHub Activity Heatmap**
  - Visual representation of my contributions

- [ ] **Skill Documentation**
  - Write up how each skill works, edge cases, etc.
