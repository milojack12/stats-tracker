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
- **last_check**: 2026-03-08 19:46
- **notes**: ✅ Changes addressed: Star Catcher mini-game with arrow keys, score tracking, particle effects, retro terminal theme

### task-003: Social Icon Hover Effects
- **description**: Exciting hover animations on footer social icons
- **repo**: milojack12/site
- **pr**: #73
- **branch**: feat/easter-egg-hover-effects
- **status**: `changes_requested`
- **created**: 2026-02-18
- **last_check**: 2026-03-08 19:46
- **notes**: ✅ Changes addressed (2026-03-05): Fixed icon visibility with multiple commits (_add explicit width/height, remove color:inherit, simplify to CSS-based effects, fix AnimatedIcon wrapper_). Icons now render properly with hover effects. Pushed - ready for re-review.

---

*No completed tasks yet.*

### task-004: Hidden Terminal Easter Egg
- **description**: Mini CLI overlay that opens with ` key, has commands like help, whoami, projects, secret
- **repo**: milojack12/site
- **pr**: #75
- **branch**: feat/easter-egg-terminal
- **status**: `waiting_review`
- **created**: 2026-02-19
- **last_check**: 2026-03-08 19:46
- **notes**: ✅ Updated (2026-02-21): Completely rewritten to be about Jack (not Milo). Commands now show Jack's info, projects, contact details. Modern theme using site's color palette instead of retro green. Added dark mode support. Ready for review. PR: https://github.com/jackmorrison12/site/pull/75
