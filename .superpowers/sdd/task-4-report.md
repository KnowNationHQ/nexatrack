# Task 4 Report: Replace Formspree with Own Form Submissions API

## Changes Made

Replaced all Formspree forms (`https://formspree.io/f/meoebapa`) across 8 HTML pages with our own Supabase Edge Function endpoint.

### Forms replaced per page

| Page | Forms |
|------|-------|
| index.html | `#quote-form` (quote section), `#newsletter-form` (footer) |
| contact.html | `#contact-form` (contact page), `#newsletter-form` (footer) |
| quote.html | `#quote-form` (quote page), `#newsletter-form` (footer) |
| about.html | `#newsletter-form` (footer) |
| service.html | `#newsletter-form` (footer) |
| feature.html | `#newsletter-form` (footer) |
| tracking.html | `#newsletter-form` (footer) |
| chatbot.html | `#newsletter-form` (footer) |

### What was done
- Removed `action` and `method` from each `<form>`, added unique `id`
- Added inline `<script>` before `</body>` with a self-executing function that:
  - Intercepts form submit via `addEventListener`
  - Serializes form data as `{ type, data: { key: value } }`
  - POSTs JSON to the Edge Function endpoint
  - Replaces the form with a success alert on 200, or shows error with phone fallback
- Pages with multiple forms (index, contact, quote) handle both in one script block using an array loop
- Pages with only the newsletter form handle it with a focused single-form script

### API endpoint
`POST https://ujcokrzjvjdrcrdhcnjy.supabase.co/functions/v1/shipments-api?action=submit-form`
Content-Type: `application/json`

### Error handling
- Uses `NXT_PHONE` global (from `js/main.js`) if available, falls back to `'+1 (506) 501-4402'`
- On success: form is replaced with an `alert-success` div
- On failure: browser `alert()` with phone number

### Verification
- Grep for `formspree` across all HTML files: **0 matches**
