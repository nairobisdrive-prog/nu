# Project: Xaan Real Estate Platform (Rentals Focus)

## 1. Project Context & Overview
- **Goal:** Create a new website functioning as a web app (and eventually mobile app) for the Mexican market.
- **Key Constraint:** Mexico has no MLS (Multiple Listing Service), so no Zillow or Homes.com exists.
- **Data Strategy:** Use Firecrawl to pull data from local sites into a unified database (similar to Zillow pulling from MLS).
- **Current Phase:** Focus solely on the **web app**. Get templates for output/input running (like a WordPress real estate site using ACF).
- **Existing Work:** Two design results exist in `glm` and `gpt` directories. Use these as the foundation.
    - Reference naming: "built - glm" or "built - gpt". If no specific note, use exactly what is already built. Most work is rearranging existing parts.

## 2. Design System
### 2.1 Color Palette (Override `design.md`)
```css
/* CSS Variables */
--#40208e: #40208e;
--#17142d: #17142d;
--#261856: #261856;
--#5b25c1: #5b25c1;
--#8c5873: #8c5873;

/* Theme Roles */
primary: "#271868";
secondary: "#000000";
tertiary: "#5b25c1";
neutral: "#261856";
background: "#000000";
surface: "#5b25c1";
text-primary: "#111111";
text-secondary: "#FFFFFF";
border: "#000000";
accent: "#7629a5";

2.2 Typography
Rule: All typography, except for the homepage hero, must match the GPT version exactly **Font family:** [Inter]

### H2 — Section heading
- Size: `text-4xl` (mobile) → `text-6xl` (sm+)
- Weight: `font-semibold` (600)
- Tracking: `-0.06em`
- Color: `#141821` (near-black)
- Line-height: default (tight)

### Subheading (lede paragraph)
- Size: `text-lg` (18px)
- Weight: `font-normal` (400)
- Line-height: `leading-8` (32px)
- Color: `#5B25C1 
- Tracking: default

### Body
- Size: `text-base` (16px)
- Weight: `font-normal` (400)
- Line-height: `leading-7` or `leading-8`
- Color: `#242424` 

### EYEBROWS
- Size: `text-lg` (18px)
- Weight: `font-normal uppercase` (400)
- Line-height: `leading-8`
- Color: `#221854` 
- Tracking: 0.22em

Exception: Homepage hero typography can follow its own existing design.

## 3. Technical Stack & Setup
Deployment: Hostinger's Node web apps.

Database: Hostinger SQL database.

Database Name: u973983966_xaanrent

Database User: u973983966_xaanrent

Password: WtR:D&T/1

Remote SQL Hostname: srv554.hstgr.io (or IP: 31.97.208.50)

Development Principle: No hardcoding. Start with a database and dummy data from the beginning.

## 4. Site Structure 
Focus: Right now, focus on the Rental Site.

Rental Types:

Short Term (Airbnb style)
Long Term (Traditional real estate)
Second Site: Sales site (to be built later, but interlinked).

## 5. Core Components (Reusable)
Component	Source / Instruction
Header	All pages except homepage. Use Airbnb-style layout from reference images: Logo (left), Search Bar (center), "Become a host" link, Login button, Hamburger menu. Toggle in search bar for Short Term / Long Term.
Footer	Universal. Use "built - glm".
Property Cards (Short Term)	Use glm / cards1.
Property Cards (Long Term)	Use glm / cards2. Change accent color per reference images.
Card Hover Action	Keep the same auto-scroll on hover action as the GPT cards, but at half the speed.
Blog Cards	Create new, on-brand design.


## 6. Pages to Build (Detailed)
### 6.1 Homepage
Hero: Already done in root dir / stitch folder. Add a search bar to the middle. No other changes.

Section 1: Recently Viewed – Last 8 properties viewed. Use Property Cards.

Section 1b: Recent Searches – Last 5 searches completed. Use reference image style for display.

Section 2:  Use "built - gpt" recently listed section. Stop checking 5 places (see ref image). Adapt copy for Short Term Rentals. For card style, use reference image "info card style".

Section 3: Suggested for You – 10 nearby properties, similar budget/beds.

Footer: As defined above.

### 6.2 Authentication & Dashboards
Login Page: For both agent and user. Needs to be created.

Agent Dashboard: Already built (agent - gpt).

User Dashboard: Already built (user - glm).

### 6.3 Listing Pages (Search + Map)
Short Term Rental Page: Search map + listings with toggle. Exactly as built, but update cards to glm / cards1.

Long Term Rental Page: Search map + listings with toggle. Exactly as built, but update cards to glm / cards2.

### 6.4 Single Property Page (Detailed)
Hero: Built (gpt) – title + image accordion/gallery layout.

Modification: Make layout 100vh so the accordion fits vertically.

Inside Accordion Border: Use the "Mazatlan Property Guide" component from reference images (actual component). Use "accordion layout ref image".

Right Side: Vertical scrolling image with controls.

Section 2: Masonry-style gallery of first 15 images (full width).

Rest of Body: Built (glm) body – from "body start reference image" to footer.

### 6.5 Agent & Blog Pages
Find an Agent Page: Built (glm).

Blog Page: Needs to be built.

Blog Template: Needs to be built.

### 6.6 Admin Dashboard
Purpose: For the site owner (you).

Requirements: Must allow adding listings and blogs.

7. Immediate Development Tasks (Summary)
Set up Hostinger Node/SQL environment with provided credentials.

Create database schema and seed with dummy data.

Implement global design system (colors + GPT typography).

Assemble reusable components (Header, Footer, Cards, etc.) from existing "built" code.

Build each page sequentially, referencing "built - glm/gpt" or creating new where specified.

Ensure Short Term/Long Term toggle logic is functional in headers and search pages.

Implement the Admin Dashboard for content management.