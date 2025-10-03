# Fresh Sequence Builder


A web UI to create and schedule 1–3 partnership emails for one contact with intelligent validation and keyboard support.

**Live Demo**: [Live site](https://fresh-sequence-builder-2.netlify.app/)  


**Screens Implemented**:
- Template picker (3 partnership sequences)
- Dynamic inputs panel (15+ validated fields)
- Email step editor (pre-generated content per template)
- Schedule picker (keyboard shortcuts + validation)
- Review & Start (edit-anywhere capability)

**Validation Rules**:
- ✅ No past times
- ✅ First send ≥ 5 minutes from now
- ✅ Sequential order enforced (Block approach - see below)

**Keyboard Support**:
- ✅ `↑↓` arrows ±15 minutes
- ✅ `Shift+↑↓` arrows ±60 minutes
- ✅ `Enter` to edit
- ✅ `Esc` to cancel

---

## 🎯 Block vs Cascade Decision

**Chosen: Block Approach**

**What it does**: Shows explicit errors when emails are scheduled out of order. Does NOT auto-adjust times.

**Why Block**:
1. **User control** - Partnership emails are deliberate; users want precise timing
2. **Clear mental model** - "Fix it yourself" is more predictable than silent auto-adjustments
3. **Error prevention** - Explicit feedback prevents repeated mistakes
4. **Technical simplicity** - Simple validation: `email2.time > email1.time`

**Example**:
```
Email 1: Oct 10, 10am
Email 2: Oct 10, 9am ← INVALID

Block: Shows error "Email 2 must be after Email 1"
Cascade: Would silently adjust to 10:01am

Block = User stays in control ✓
```

**Trade-off**: Users must manually fix errors. Acceptable because:
- Small sequences (1-3 emails)
- Deliberate outreach (not high-volume)
- Manual fix takes <5 seconds

---

## 💻 Tech Stack

**Choices**:
- React 18 (Hooks, useReducer + Context for state)
- Tailwind CSS (rapid prototyping, consistent design)
- Next.js 14 (Vercel-native deployment)
- No external dependencies (date handling, validation)

**Rationale**:
- **React** - Industry standard, assessment handoff-friendly
- **Tailwind** - Fast development without CSS file management
- **useReducer** - Sufficient for single-sequence state (Redux overkill)
- **No dependencies** - Smaller bundle, demonstrates fundamentals

**Trade-offs**:
- Heavier than vanilla JS, but gains development velocity
- Would use date library (date-fns) for production complexity
- Would add Redux for multi-user features

---

## 📝 Assumptions

1. **Email content**: Templates provide pre-generated text (simulating AI). User can edit. Live AI integration is Deliverable 2.
2. **Single sequence**: One user, one contact, one sequence at a time. No draft persistence needed.
3. **Timezone**: All times in user's local timezone. No recipient timezone conversion.
4. **Validation tiers**: 
   - Hard errors (red) = block submission
   - Warnings (yellow) = allow but inform (weekends, off-hours)
5. **Delivery**: Success screen confirms scheduling. Actual email sending is backend (out of scope).

---

## 🧪 Testing Completed

**Core flows**:
- ✅ Happy path (template → inputs → emails → schedule → review → success)
- ✅ Validation triggers correctly (past time, out-of-order, missing fields)
- ✅ Keyboard shortcuts work (↑↓, Shift+↑↓, Esc, Enter)
- ✅ Back button preserves state
- ✅ Edit links from review screen work

**Edge cases**:
- ✅ Rapid keyboard input
- ✅ Long text in fields
- ✅ Different template types (2-email vs 3-email)
- ✅ Preset edge cases (midnight, month-end)

**Accessibility**:
- ✅ Full keyboard navigation
- ✅ Screen reader labels
- ✅ WCAG AA color contrast

---

## 🚀 Quick Start

**Local**:
```bash
npm install
npm run dev  # http://localhost:3000
```

**Test the Block approach**:
1. Go to Schedule Picker (step 4)
2. Set Email 1 to tomorrow at 10am
3. Set Email 2 to tomorrow at 9am
4. See error: "Email 2 must be after Email 1"
5. Fix it → error clears automatically


