Demo User Accounts
Overview
Use these demo accounts to test the different user roles and their permissions in the system. All accounts use any password for testing purposes.

🎓 Learner Account
Credentials
Email: <learner@quantummint.com>
Password: Any password (e.g., password123)
What You'll See
Redirected to: /dashboard (Learner Dashboard)
Navigation Access:
✅ Home
✅ Marketplace
✅ Library
✅ Wallet
✅ Pricing
❌ Create (Hidden)
❌ Dashboards Dropdown (Hidden)
Features
View listening statistics
Track reading progress
Manage subscriptions
View wallet and transactions
Browse and purchase books
🎨 Creator Account
Credentials
Email: <creator@quantummint.com>
Password: Any password (e.g., password123)
What You'll See
Redirected to: /creator (Creator Dashboard)
Navigation Access:
✅ Home
✅ Marketplace
✅ Create (Visible)
✅ Library
✅ Wallet
✅ Pricing
❌ Dashboards Dropdown (Hidden)
Features
Create and publish audiobooks
View earnings analytics
Manage voice cloning
Track listener statistics
Request payouts
👨‍💼 Admin Account
Credentials
Email: <admin@quantummint.com>
Password: Any password (e.g., password123)
What You'll See
Redirected to: /admin (Admin Dashboard)
Navigation Access:
✅ Home
✅ Marketplace
✅ Create (Visible)
✅ Library
✅ Wallet
✅ Pricing
✅ Dashboards Dropdown (Visible with all dashboard links)
Special Access
Dashboards Dropdown shows:

📊 My Dashboard
💼 Creator Dashboard
🛠️ Support Dashboard
🔧 Admin Dashboard
Features
Access ALL dashboards
Manage all users
View platform analytics
Manage books and content
Wallet management
System configuration
🛠️ Support Account
Credentials
Email: <support@quantummint.com>
Password: Any password (e.g., password123)
What You'll See
Redirected to: /support (Support Dashboard)
Navigation Access:
✅ Home
✅ Marketplace
✅ Library
✅ Wallet
✅ Pricing
❌ Create (Hidden)
❌ Dashboards Dropdown (Hidden)
Features
Handle user support tickets
View user accounts
Assist with technical issues
Access user history
Alternative Email Formats
The system recognizes roles based on email patterns:

Learner Roles
Any email that doesn't match other patterns:

<john@example.com>
<test@test.com>
<user@domain.com>
Creator Roles
Emails containing "creator" or "teacher":

<creator@example.com>
<teacher@school.com>
<john.creator@domain.com>
<my.teacher@edu.com>
Admin Roles
Emails containing "admin":

<admin@example.com>
<super.admin@company.com>
<administrator@domain.com>
Support Roles
Emails containing "support":

<support@example.com>
<help.support@company.com>
<customer.support@domain.com>
Quick Test Guide

1. Test Learner Role
1. Go to <http://localhost:5173/signin>
2. Email: <learner@quantummint.com>
3. Password: password123
4. Click "Sign In"
✅ Redirects to /dashboard
✅ "Create" tab is hidden
✅ "Dashboards" dropdown is hidden
✅ "Wallet" tab is visible
2. Test Creator Role
1. Sign out (if logged in)
2. Go to /signin
3. Email: <creator@quantummint.com>
4. Password: password123
5. Click "Sign In"
✅ Redirects to /creator
✅ "Create" tab is visible
✅ Can create audiobooks
✅ See earnings dashboard
3. Test Admin Role
1. Sign out (if logged in)
2. Go to /signin
3. Email: <admin@quantummint.com>
4. Password: password123
5. Click "Sign In"
✅ Redirects to /admin
✅ "Create" tab is visible
✅ "Dashboards" dropdown is visible
✅ Can access all 4 dashboards
4. Test Support Role
1. Sign out (if logged in)
2. Go to /signin
3. Email: <support@quantummint.com>
4. Password: password123
5. Click "Sign In"
✅ Redirects to /support
✅ "Create" tab is hidden
✅ "Dashboards" dropdown is hidden
Testing Protected Routes
Test 1: Unauthenticated Access
1. Make sure you're signed out
2. Try to navigate to /marketplace
✅ Should redirect to /signin
3. Sign in with any demo account
✅ Should redirect back to /marketplace
Test 2: Role-Based Navigation
1. Sign in as <learner@quantummint.com>
✅ "Create" should be hidden
2. Sign out
3. Sign in as <creator@quantummint.com>
✅ "Create" should be visible
Test 3: Wallet Access
1. Sign out completely
2. Try to access /wallet directly
✅ Should redirect to /signin
3. Sign in with any account
✅ Should redirect to /wallet
✅ Can view balance and transactions
Feature Access Matrix
Feature Learner Creator Admin Support
Browse Books ✅ ✅ ✅ ✅
Purchase Books ✅ ✅ ✅ ✅
Create Books ❌ ✅ ✅ ❌
Library ✅ ✅ ✅ ✅
Wallet ✅ ✅ ✅ ✅
Subscription ✅ ✅ ✅ ✅
My Dashboard ✅ ✅ ✅ ✅
Creator Dashboard ❌ ✅ ✅ ❌
Support Dashboard ❌ ❌ ✅ ✅
Admin Dashboard ❌ ❌ ✅ ❌
Dashboards Dropdown ❌ ❌ ✅ ❌
Voice Cloning ❌ ✅ ✅ ❌
Earnings Analytics ❌ ✅ ✅ ❌
Notes
Any Password Works: For demo purposes, any password will work with these accounts
Email Pattern Recognition: The system uses email content to determine role
Session Persistence: Login state is saved in localStorage
Test Switching: Sign out and sign in with different accounts to test role switching
Protected Routes: All routes except /, /signin, and /get-started require authentication
Common Issues
Issue: Not seeing expected navigation items
Solution:

Sign out completely
Clear localStorage: Open DevTools → Application → Local Storage → Clear
Sign in again with the correct demo account
Issue: Still seeing old role after switching accounts
Solution:

Always click "Sign Out" before signing in with a different account
The sign out button clears the authentication state
Issue: Redirected to wrong dashboard
Solution:

Check that you're using the correct email format
Emails with "admin" → Admin role
Emails with "creator" or "teacher" → Creator role
Emails with "support" → Support role
Everything else → Learner role
Production Note
⚠️ Important: In production, replace the email pattern matching with actual role data from your backend API. The current implementation is for demo and testing purposes only.
