# Quick Troubleshooting for QuantumMint Sign In/Out Buttons

## Step 1: Open Browser DevTools (Press F12)

### Check Network Tab:
1. Go to **Network** tab in DevTools
2. Click the **Sign In** button
3. Look at the request that appears:
   - **Expected URL:** `http://localhost:3002/auth/login` (or similar)
   - **Status:** Should be `200` for success, `401`/`403` if auth failed
   - If you see `404`, service isn't running
   - If you see **red text**, the request failed

### Questions to Answer:
```
❓ Do you see a network request appear? YES / NO
❓ What's the HTTP status code? ___________
❓ What's the response body (click on request to see)? ___________
❓ Is the request trying to POST to localhost:3002? YES / NO
```

---

## Step 2: Check Browser Console

1. Go to **Console** tab in DevTools
2. Click the **Sign In** button
3. Look for error messages in red

### Common Errors You Might See:

```javascript
// ❌ This means backend isn't running:
Network Error: Network Error: No response from server

// ❌ This means wrong port:
HTTP 404 Not Found

// ❌ This means auth failed:
HTTP 401 Unauthorized  // or 403 Forbidden

// ❌ This means CORS issue:
Cross-Origin Request Blocked: ...

// ❌ This means timeout:
Network timeout exceeded
```

---

## Step 3: Check Local Storage

1. Go to **Application** tab → **Local Storage** in DevTools
2. Look for entry: `http://localhost:3000` (or your frontend URL)

### After Login Should Show:
```
auth_token: eyJhbGciOiJIUzI1NiI... (long string)
user: {"id":"...","email":"...","name":"..."}
```

### Check:
```
❓ Does localStorage have 'auth_token'? YES / NO
❓ Does localStorage have 'user'? YES / NO
```

---

## Step 4: Check if Backend Services Are Running

Open a terminal and check if services are listening:

### Windows PowerShell:
```powershell
# Check if port 3002 is listening (User Service)
netstat -ano | findstr ":3002"

# If you see a result like:
#   TCP    127.0.0.1:3002    LISTENING    12345
# Then the service IS running

# Check all ports at once:
netstat -ano | findstr ":300[0-9]"
```

### Expected Output (Service Running):
```
  TCP    0.0.0.0:3002           LISTENING       12345
```

### Expected Output (Service NOT Running):
```
(no output)
```

### Which Services Are Running?
```
Port 3002: User/Auth Service
Port 3003: Book Service  
Port 3004: Audio Service
Port 3005: Wallet Service
Port 3006: Order Service
Port 3008: Analytics Service
Port 3009: Payment Service
Port 3010: Notification Service
Port 3011: Seller Service
Port 3012: Admin Service
Port 3013: Referral Service
Port 3014: Gift Service
Port 3015: Search Service
```

---

## Step 5: Quick Fix - Enable Error Messages

1. Open DevTools Console
2. Paste this to see what error occurred:

```javascript
// Show the last error that happened
console.error("Last app error:", window.lastError);

// Check if user is logged in
console.log("Current user:", localStorage.getItem('user'));
console.log("Auth token:", localStorage.getItem('auth_token'));
```

---

## Step 6: Try Logout in Sidebar Instead of Header

The **Sidebar Sign Out button** uses plain HTML, while the **Header Sign Out button** uses a component that might have issues.

1. Look for sidebar on the left (on desktop)
2. Scroll down in sidebar
3. Click **Sign Out** button
4. Does it work? YES / NO

If Sidebar logout works but Header doesn't → it's a Header Button component issue.

---

## Step 7: Check Console Logs When Clicking Buttons

The app should log messages. Check DevTools Console for:

```javascript
// What you CAN'T see now (no logging):
// ❌ "Login attempt with email: user@example.com"
// ❌ "Login response: {user: {...}}"  
// ❌ "Login failed: 401 Unauthorized"

// This means logging isn't implemented - you're flying blind
```

---

## What To Report Back

When you contact support, please provide:

```
1. Network tab screenshot showing the failed request
2. Console error messages (copy/paste)
3. The HTTP status code of the failed request  
4. Output of: netstat -ano | findstr ":300[0-9]"
5. localStorage contents (from DevTools Application tab)
6. Backend service logs (if you have access)
7. Your environment:
   - Frontend running on: http://localhost:3000 (or?)
   - Backend services running? YES / NO
   - Any error messages when starting backend?
```

---

## Quick Diagnosis Tree

```
                    Click Sign In Button
                            |
                    Does loading spinner show?
                         /        \
                       YES         NO
                       |            |
                    Wait 3 sec  Component Issue
                       |           (Button not clickable)
                       |
              Network request made?
                    /         \
                  YES          NO
                  |            |
            Check response   May be CORS issue
                  |          or network blocked
                  |
          Status code 200?
             /    |    \
           YES    NO    TIMEOUT
           |      |       |
        ✅ OK   Auth    Server
              Failed   Hanging
```

---

## Immediate Actions

### If JSON shows login succeeded but no navigation:
1. Check browser console for JavaScript errors
2. Check if `localStorage` has `auth_token`  
3. Manually clear localStorage and try again:
```javascript
localStorage.clear();
```

### If network request fails:
1. Is backend running? (use netstat check)
2. Try directly: `curl http://localhost:3002/health`
3. Check CORS headers in backend response

### If "stuck on loading":
1. Refresh page (F5)
2. Clear cache (Ctrl+Shift+Delete)
3. Try in Incognito window (Ctrl+Shift+N)
4. Try different browser (Chrome vs Firefox vs Edge)

---

## Testing Checklist

After making any fixes, test:

```
Login Flow:
  [ ] Can click Sign In button (not disabled)
  [ ] Loading spinner appears  
  [ ] Network request is made
  [ ] Success → user redirected or localStorage updated
  [ ] Error → error message displays (not just stuck loading)

Logout Flow:
  [ ] Sign Out button visible when logged in
  [ ] Can click Sign Out button (not disabled)
  [ ] localStorage is cleared
  [ ] Redirected to login/home page
  [ ] Can see Sign In button again

Persistence:
  [ ] After login, refresh page
  [ ] User should still be logged in
  [ ] Sign Out button still visible
  [ ] Logout clears localStorage
```

---

## One-Line Test Commands

```bash
# Test if port 3002 responds to simple request
curl -X POST http://localhost:3002/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}'

# Check all services
for port in 3002 3003 3004 3005 3006 3008 3009 3010 3011 3012 3013 3014 3015; do netstat -ano | findstr :$port && echo "Port $port is open" || echo "Port $port is closed"; done
```

---

## Expected Behavior After Fix

### Sign In Flow:
```
1. User enters email: test@example.com
2. User clicks "Sign In"
   ↓ Button shows spinner
   ↓ Network request to localhost:3002/auth/login
   ↓ On success → localStorage updated, page redirects
   ↓ On error → Error message shown, spinner stops
3. Button is always clickable (never frozen in disabled state)
```

### Sign Out Flow:
```
1. User clicks "Sign Out" (Header or Sidebar)
   ↓ Button shows loading state (optional)
   ↓ localStorage is cleared
   ↓ User redirected to home/login
2. Button is always clickable
3. Error (if any) is shown
```

---

## Contact Support With This Info

When reporting the issue, include:
- [ ] Screenshot of Network tab error
- [ ] Copy of Console error message
- [ ] Output from `netstat -ano | findstr ":3002"`
- [ ] What happens step-by-step when you click buttons
- [ ] Whether Sidebar Sign Out vs Header Sign Out works

