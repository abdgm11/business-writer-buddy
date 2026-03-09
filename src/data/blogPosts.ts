export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "professional-email-writing-guide",
    title: "The Ultimate Guide to Professional Email Writing in 2025",
    description: "Master the art of professional email communication with actionable tips on tone, structure, and clarity that get results.",
    date: "2025-03-01",
    readTime: "8 min read",
    category: "Email Writing",
    content: `# The Ultimate Guide to Professional Email Writing in 2025

Great emails don't just communicate — they **persuade, clarify, and build trust**. Whether you're writing to a client, manager, or colleague, the way you write speaks volumes about your professionalism.

## Why Email Writing Still Matters

Despite the rise of Slack and Teams, email remains the default channel for formal communication. A 2024 study found that professionals spend **28% of their workday** reading and writing emails.

## The 5-Part Framework

### 1. Subject Line
Your subject line is the headline. Make it specific and action-oriented:
- ❌ "Meeting"
- ✅ "Q2 Budget Review — Action Needed by Friday"

### 2. Opening Line
Skip "I hope this email finds you well." Instead, lead with context:
- "Following up on our call about the vendor contract…"
- "Quick question about the timeline for the redesign…"

### 3. Body
Keep paragraphs to 2-3 sentences max. Use bullet points for multiple items:
- One idea per paragraph
- Bold key deadlines or asks
- Use numbered lists for sequential steps

### 4. Call to Action
Every email should have a clear next step:
- "Could you review and share feedback by Thursday?"
- "Let me know if Tuesday at 2pm works."

### 5. Sign-off
Match your tone to the relationship. "Best" works for most professional contexts. "Thanks" for requests. "Cheers" for informal teams.

## Common Mistakes to Avoid
- Writing walls of text without formatting
- Being vague about what you need
- Using passive voice excessively ("It was decided that…")
- Forgetting to proofread — typos erode credibility

## The ProseAI Advantage
ProseAI catches tone mismatches, grammar slips, and unclear phrasing before you hit send. It's like having an editor in your inbox.`,
  },
  {
    slug: "grammar-mistakes-non-native-speakers",
    title: "10 Grammar Mistakes Non-Native English Speakers Make at Work",
    description: "Avoid the most common grammar pitfalls that undermine your professional credibility — with before-and-after examples.",
    date: "2025-02-20",
    readTime: "6 min read",
    category: "Grammar",
    content: `# 10 Grammar Mistakes Non-Native English Speakers Make at Work

Even fluent non-native speakers slip on these common patterns. Here's how to catch and fix them.

## 1. Article Misuse (a/an/the)
- ❌ "Please send me report."
- ✅ "Please send me **the** report."

## 2. Preposition Confusion
- ❌ "I'm interested on this project."
- ✅ "I'm interested **in** this project."

## 3. Subject-Verb Agreement
- ❌ "The team are ready."
- ✅ "The team **is** ready." (American English)

## 4. Tense Inconsistency
Switching between past and present within the same paragraph confuses readers.

## 5. Run-On Sentences
Break long sentences into two. If a sentence has more than one main idea, split it.

## 6. Misplaced Modifiers
- ❌ "I almost finished all the tasks."
- ✅ "I finished almost all the tasks."

## 7. Incorrect Word Forms
- ❌ "We need to discussion this."
- ✅ "We need to **discuss** this."

## 8. Double Negatives
- ❌ "I don't have no time."
- ✅ "I don't have **any** time."

## 9. Comma Splices
- ❌ "The deadline is tomorrow, we need to hurry."
- ✅ "The deadline is tomorrow**;** we need to hurry."

## 10. Overusing "Very"
Replace "very" with stronger words: "very good" → "excellent", "very tired" → "exhausted".

## How ProseAI Helps
ProseAI identifies these patterns in your writing and explains corrections so you learn over time — not just fix once.`,
  },
  {
    slug: "linkedin-profile-optimization",
    title: "How to Write a LinkedIn Profile That Gets You Noticed",
    description: "Optimize your LinkedIn headline, summary, and experience sections to attract recruiters and build your personal brand.",
    date: "2025-02-10",
    readTime: "7 min read",
    category: "Career",
    content: `# How to Write a LinkedIn Profile That Gets You Noticed

Your LinkedIn profile is your digital first impression. Here's how to make it count.

## The Headline Formula
Don't just list your job title. Use this formula:
**[Role] | [What you do] | [Who you help]**

Example: "Product Manager | Building fintech tools | Helping teams ship faster"

## Summary Section
Your summary should answer three questions:
1. What do you do?
2. What's your unique angle?
3. What are you looking for?

Write in first person. Keep it under 300 words. Open with a hook — not "I am a dedicated professional."

## Experience Section Tips
- Lead with impact, not tasks: "Grew user base by 40%" beats "Managed user acquisition"
- Use numbers whenever possible
- Include 3-5 bullet points per role
- Start bullets with strong action verbs: Led, Built, Shipped, Reduced

## Skills & Endorsements
Pin your top 3 skills. Ask colleagues for endorsements — it boosts your search ranking.

## The "Featured" Section
Add:
- A recent article or presentation
- A portfolio piece
- A case study or project summary

## ProseAI for LinkedIn
Use ProseAI to polish your summary and experience bullets. It catches awkward phrasing and suggests more impactful alternatives.`,
  },
  {
    slug: "business-writing-tone-guide",
    title: "Mastering Tone in Business Writing: Formal vs. Friendly",
    description: "Learn when to be formal, when to be friendly, and how to strike the right balance in professional communication.",
    date: "2025-01-28",
    readTime: "5 min read",
    category: "Tone & Style",
    content: `# Mastering Tone in Business Writing: Formal vs. Friendly

Tone is the personality of your writing. Get it wrong, and you risk sounding cold, unprofessional, or too casual.

## The Tone Spectrum
Think of tone as a dial, not a switch:
- **Formal**: Legal docs, executive summaries, external proposals
- **Professional**: Client emails, team updates, reports
- **Friendly**: Internal Slack messages, peer feedback, casual check-ins

## Formal Tone Markers
- Third person ("The team recommends…")
- Complete sentences, no contractions
- Structured with headings and numbered points

## Friendly Tone Markers
- First person ("I think we should…")
- Contractions ("We're on track")
- Shorter sentences, conversational flow

## Context Matters
The same person might need different tones:
- Email to CEO → Professional-formal
- Slack to teammate → Friendly
- Client proposal → Formal
- Team retro notes → Professional-friendly

## Common Tone Mistakes
1. Being too formal in casual channels (sounds robotic)
2. Being too casual in external communication (sounds unprofessional)
3. Mixing tones within the same document

## How ProseAI Detects Tone
ProseAI analyzes your writing and flags tone mismatches. Writing a client email that sounds too casual? It'll suggest adjustments before you send.`,
  },
  {
    slug: "slack-messages-professional-guide",
    title: "How to Write Better Slack Messages at Work",
    description: "Communicate clearly and professionally on Slack with these practical tips for formatting, tone, and etiquette.",
    date: "2025-01-15",
    readTime: "5 min read",
    category: "Workplace Communication",
    content: `# How to Write Better Slack Messages at Work

Slack is fast. But fast doesn't mean sloppy. Here's how to communicate clearly without writing essays.

## The Golden Rule: Front-Load Context
Don't send "Hi" and wait. Instead:
- ❌ "Hi" … [3 min pause] … "Can I ask you something?"
- ✅ "Hi! Quick question about the API docs — is the auth section up to date?"

## Formatting Tips
Use Slack's built-in formatting:
- **Bold** for key points
- Bullet lists for multiple items
- Code blocks for technical content
- Threads for follow-up discussions

## Channel Etiquette
- Use threads to avoid cluttering channels
- @mention only when someone needs to act
- Use reactions instead of "thanks" or "ok" messages
- Pin important decisions or resources

## Status Updates
For async teams, post structured updates:
**What I did**: Shipped the onboarding flow
**What's next**: Starting on analytics dashboard
**Blockers**: Waiting on API access from DevOps

## When to Move to Email
If your Slack message is longer than 5 lines, it probably belongs in an email or a doc.

## ProseAI for Slack
Even casual messages benefit from clarity. ProseAI helps you rephrase confusing messages and catch tone issues before you post.`,
  },
  {
    slug: "ai-writing-tools-comparison-2025",
    title: "AI Writing Tools Compared: Which One Actually Helps You Learn?",
    description: "A comparison of AI writing assistants for professionals — Grammarly, ChatGPT, ProseAI, and more. Find the right tool for your needs.",
    date: "2025-01-05",
    readTime: "9 min read",
    category: "Tools & Productivity",
    content: `# AI Writing Tools Compared: Which One Actually Helps You Learn?

There are dozens of AI writing tools. But not all of them help you **get better** at writing. Here's an honest comparison.

## The Landscape in 2025

### Grammarly
- **Best for**: Grammar and spell-checking
- **Limitation**: Focuses on corrections, not learning
- **Pricing**: Free tier + Premium at $12/mo

### ChatGPT
- **Best for**: Generating drafts, brainstorming
- **Limitation**: Writes *for* you rather than teaching you
- **Pricing**: Free + Plus at $20/mo

### Hemingway Editor
- **Best for**: Readability improvements
- **Limitation**: No AI-powered suggestions, limited scope
- **Pricing**: Free (web) / $19.99 (desktop)

### ProseAI
- **Best for**: Non-native speakers who want to *learn and improve*
- **Unique features**:
  - Explains every correction
  - Tracks your progress over time
  - Gamified learning with streaks and badges
  - Context-aware tone analysis
- **Pricing**: Free tier with 5 daily rewrites + affordable Pro plan

## What Makes ProseAI Different?

Most tools fix your writing. ProseAI teaches you **why** something was wrong so you don't make the same mistake twice. It's the difference between a spell-checker and a writing coach.

## Who Should Use What?
- **Just need spell-check?** → Grammarly
- **Need to generate content?** → ChatGPT
- **Want to actually improve your English writing?** → ProseAI

## The Bottom Line
If you're a non-native English speaker building a career, you need a tool that helps you grow — not one that does the work for you.`,
  },
];
