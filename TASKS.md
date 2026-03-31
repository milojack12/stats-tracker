# TASKS.md - Active Tasks

> This file tracks work in progress. Update immediately when starting or completing work.

## Format

Each task has:
- **id**: Short identifier
- **description**: What needs to be done
- **repo**: Repository (e.g., milojack12/milojack12)
- **pr**: PR number (if applicable)
- **status**: `in_progress` | `waiting_review` | `changes_requested` | `completed` | `blocked`
- **created**: Date task was created
- **last_check**: Last time heartbeat checked this task
- **notes**: Any relevant context

---

## Active Tasks

### task-001: Setup GitHub Profile
- **description**: Create milojack12 profile README with personality
- **repo**: milojack12/milojack12
- **pr**: #1
- **status**: `completed`
- **created**: 2026-02-18
- **completed_at**: 2026-02-18T14:35:00Z
- **notes**: PR merged! Profile live at https://github.com/milojack12

### task-002: Konami Code Easter Egg
- **description**: Add Konami code (↑↑↓↓←→←→BA) detector with Star Catcher mini-game
- **repo**: milojack12/site
- **pr**: #74
- **branch**: feat/easter-egg-konami-v2
- **status**: `waiting_review`
- **created**: 2026-02-18
- **last_check**: 2026-03-31 17:07
- **notes**: ✅ Changes addressed: Star Catcher mini-game with arrow keys, score tracking, particle effects, retro terminal theme. Jack reviewed with COMMENTED (2026-02-19), waiting for approval. No new reviews.

### task-003: Social Icon Hover Effects
- **description**: Exciting hover animations on footer social icons
- **repo**: milojack12/site
- **pr**: #73
- **branch**: feat/easter-egg-hover-effects
- **status**: `changes_requested`
- **created**: 2026-02-18
- **last_check**: 2026-03-31 17:07
- **notes**: ✅ Fix pushed (2026-03-26): Simplified CSS to fix visibility. Removed potential conflicting props (color override, padding overflow, max-width). Icons now inherit color from .footer a. Hover effects preserved. Still waiting for Jack's re-review.

### task-004: Hidden Terminal Easter Egg
- **description**: Mini CLI overlay that opens with ` key, has commands like help, whoami, projects, secret
- **repo**: milojack12/site
- **pr**: #75
- **branch**: feat/easter-egg-terminal
- **status**: `waiting_review`
- **created**: 2026-02-19
- **last_check**: 2026-03-31 17:07
- **notes**: ✅ Addressed all feedback (2026-03-28 14:08): 1) whoami was already about Jack, fixed PR description typo 2) Already modern GitHub dark theme, updated PR description 3) Fixed newline formatting in PR description. Extended PR description with more details. Commented on PR. Waiting for review.

### task-005: Home Assistant Config Research
- **description**: Research/prepare Home Assistant configs for Jack's upcoming setup
- **repo**: milojack12/ha-config
- **status**: `completed`
- **created**: 2026-03-25
- **completed_at**: 2026-03-25T11:25:00Z
- **notes**: ✅ Repo created with starter configs: configuration.yaml, automations, scenes, scripts, integrations (lights, climate, sensors), secrets template. Live at https://github.com/milojack12/ha-config

---

*No completed tasks yet.*
