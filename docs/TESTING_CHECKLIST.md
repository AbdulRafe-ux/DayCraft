# DayCraft: manual testing checklist

Run both servers (see README). Tick **Pass** only after you have seen the behaviour yourself. Write what happened in **Notes** if it failed. Use these results in the "Testing and results" section of your report.

Use two different test accounts (A and B) and a private/incognito window for the second one.

| # | Test | Steps | Expected result | Pass | Notes |
|---|---|---|---|---|---|
| 1 | Frontend starts | `npm run dev` in `client` | Page opens at localhost:5173 | ☐ | |
| 2 | Backend starts | `npm run dev` in `server` | "API listening" message | ☐ | |
| 3 | MongoDB connects | Start backend | "MongoDB connected: daycraft" | ☐ | |
| 4 | Register | Fill in valid details on /register | Account created, dashboard opens | ☐ | |
| 5 | Duplicate registration | Register the same email again | "An account with this email already exists" | ☐ | |
| 6 | Registration validation | Try empty fields, bad email, short password, mismatched confirmation | A clear message appears under each field | ☐ | |
| 7 | Login | Log out, then log in with account A | Dashboard opens | ☐ | |
| 8 | Wrong credentials | Log in with a wrong password | "Incorrect email or password." | ☐ | |
| 9 | Protected route | While logged out, open /dashboard | Redirected to /login | ☐ | |
| 10 | Create task | Add a task with all fields | Task appears in list; success message; cards update | ☐ | |
| 11 | Persistence | Refresh the page | Still logged in; task still there | ☐ | |
| 12 | Edit task | Click edit, change priority/status | Changes appear; cards update | ☐ | |
| 13 | Mark complete | Click the circle at the left of a task | Status becomes Completed; counts update | ☐ | |
| 14 | Delete task | Click delete, then Cancel | Nothing deleted | ☐ | |
| 15 | Delete confirm | Click delete, then Delete | Task removed; counts update | ☐ | |
| 16 | Search | Type part of a title | Only matching tasks appear | ☐ | |
| 17 | Filters | Choose a status (left menu) and a priority | List matches the filters; "Clear filters" works | ☐ | |
| 18 | Sorting | Change the sort option | Order changes (newest / due date / priority) | ☐ | |
| 19 | Empty state | Filter to something with no result | Friendly empty message | ☐ | |
| 20 | Statistics | Compare cards with your list | Numbers match the real task counts | ☐ | |
| 21 | Data in MongoDB | Open Atlas → Browse Collections | `users` and `tasks` documents exist; `passwordHash` is not readable text | ☐ | |
| 22 | Ownership | Log in as B; confirm A's tasks are not visible. Then, with B logged in, open `http://localhost:5000/api/tasks/<ID of A's task>` | Response: "Task not found." | ☐ | |
| 23 | Logout | Click Log out | Home page opens; /dashboard is blocked again | ☐ | |
| 24 | Mobile layout (360 px) | Browser DevTools → device toolbar → 360 px wide | No sideways scrolling; tasks shown as cards | ☐ | |
| 25 | Tablet / laptop / desktop | Check 768, 1024 and 1440 px | Layout adapts; nothing overlaps | ☐ | |
| 26 | Keyboard | Use Tab, Enter, Esc | Visible focus ring; dialogs open/close with keyboard | ☐ | |
| 27 | Buttons and links | Click every nav link, button and footer link | Nothing is dead | ☐ | |
| 28 | Colours | Look at every screen | Only teal, cream, gold and navy | ☐ | |
| 29 | Unit tests | `npm test` in `server` | All 10 tests pass | ☐ | |

## Screenshots to take for the report

Use the real running app (browser DevTools can show phone sizes). Suggested set:

1. Home page (desktop)
2. Registration page, showing a validation message
3. Login page
4. Dashboard with several tasks and the summary cards
5. Add task dialog
6. Edit task dialog
7. Delete confirmation dialog
8. Search / filter result
9. Dashboard on a phone-sized screen
10. MongoDB Atlas, showing the `users` and `tasks` collections
11. The GitHub repository page
