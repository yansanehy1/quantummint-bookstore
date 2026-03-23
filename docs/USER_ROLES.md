# User Roles & Permissions

## Overview

QuantumMint Bookstore - Sierra Books has four distinct user roles, each with specific responsibilities and access levels.

---

## 👥 User Roles

### 1. 📚 Learner/Reader

**Primary Users:** Students, audiobook listeners, consumers

**Dashboard:** My Dashboard (`/dashboard`)

**Responsibilities:**

- Listen to audiobooks
- Track personal progress
- Manage subscriptions
- Monitor spending

**Permissions:**

- ✅ Browse marketplace
- ✅ Purchase/subscribe to content
- ✅ Listen to owned/subscribed books
- ✅ Track listening history
- ✅ Manage payment methods
- ✅ View personal analytics
- ❌ Create content
- ❌ Access admin features
- ❌ Handle support tickets

**Key Features:**

- Weekly activity tracking
- Favorite genres analysis
- Continue listening
- Spending history (SLL)
- Subscription management
- Progress tracking

---

### 2. 👨‍🏫 Teacher/Creator/Educator

**Primary Users:** Content creators, authors, educators, publishers

**Dashboard:** Creator Dashboard (`/creator`)

**Responsibilities:**

- Create and publish audiobooks
- Respond to book-related questions/issues
- Track earnings and analytics
- Manage book content
- Engage with learners

**Permissions:**

- ✅ All Learner permissions
- ✅ Create/edit/delete books
- ✅ Upload audio content
- ✅ View earnings (75% share)
- ✅ Request payouts
- ✅ Access creator analytics
- ✅ Respond to book reviews
- ✅ Handle content-related support
- ❌ Access platform admin tools
- ❌ Manage other creators
- ❌ Handle technical support

**Key Features:**

- Earnings tracking (SLL/USD)
- Revenue breakdown (subscription vs pay-per-use)
- Book performance metrics
- Listener analytics
- Payout management
- Monthly growth trends

**Support Responsibilities:**

- Answer questions about their books
- Fix content errors
- Respond to reviews
- Update book metadata
- Handle content-related complaints

---

### 3. 🔧 System Administrator

**Primary Users:** Platform owners, senior management

**Dashboard:** Admin Dashboard (`/admin`)

**Responsibilities:**

- Platform oversight
- Revenue monitoring
- User management
- Content moderation
- Business analytics
- Strategic decisions

**Permissions:**

- ✅ Full platform access
- ✅ View all users and content
- ✅ Manage platform settings
- ✅ Access financial reports
- ✅ Configure pricing
- ✅ Approve/reject content
- ✅ Suspend/ban users
- ✅ Platform-wide analytics
- ✅ Manage support staff
- ✅ Export data

**Key Features:**

- Platform revenue tracking (25% share)
- Total revenue visualization
- User statistics (5,432 users)
- Subscription breakdown
- Top creators leaderboard
- Recent books moderation
- Activity feed
- Revenue split monitoring (75/25)

**Capabilities:**

- Financial oversight
- Content moderation
- User management
- Platform configuration
- Analytics and reporting

---

### 4. 🛠️ Support Staff

**Primary Users:** Technical support team, customer service

**Dashboard:** Support Dashboard (`/support`)

**Responsibilities:**

- Handle technical issues
- Assist with platform problems
- Process refunds/disputes
- Guide users
- Escalate complex issues

**Permissions:**

- ✅ View user accounts (read-only)
- ✅ Access support tickets
- ✅ View transaction history
- ✅ Process refunds
- ✅ Access help documentation
- ✅ View user activity logs
- ✅ Send notifications to users
- ❌ Modify platform settings
- ❌ Access financial reports
- ❌ Delete content
- ❌ Handle content-related issues*

*Content-related issues redirected to Teacher/Creator

**Key Features:**

- Open tickets queue
- User lookup
- Technical issue tracking
- Response time metrics
- Escalation workflow
- Knowledge base access

**Ticket Types:**

- 💻 Technical issues (assigned to Support)
- 📚 Book/content issues (redirected to Creator)
- 💰 Payment issues (Support with Admin escalation)
- 🔐 Account issues (Support)
- 🎧 Playback issues (Support)

---

## 🎯 Responsibility Matrix

| Issue Type | Primary Handler | Escalation |
|-----------|----------------|------------|
| **Technical Problems** | Support Staff | Admin |
| **Book Content** | Teacher/Creator | Admin |
| **Payment Issues** | Support Staff | Admin |
| **Account Problems** | Support Staff | Admin |
| **Platform Bugs** | Support Staff | Admin |
| **Earnings Questions** | Teacher/Creator | Admin |
| **Subscription Management** | Support Staff | - |
| **Content Moderation** | Admin | - |

---

## 🔐 Access Levels

### Level 1: Learner/Reader

- **Scope:** Personal account only
- **Data Access:** Own data
- **Actions:** Consume content, manage subscriptions

### Level 2: Teacher/Creator/Educator

- **Scope:** Personal + Created content
- **Data Access:** Own earnings, book analytics
- **Actions:** Create content, handle book support

### Level 3: Support Staff

- **Scope:** User support
- **Data Access:** User accounts (read), tickets
- **Actions:** Resolve technical issues, assist users

### Level 4: System Administrator  

- **Scope:** Platform-wide
- **Data Access:** All data
- **Actions:** Full control, moderation, configuration

---

## 📊 Dashboard Comparison

| Feature | Learner | Creator | Support | Admin |
|---------|---------|---------|---------|-------|
| **Personal Stats** | ✅ | ✅ | ❌ | ✅ |
| **Earnings** | ❌ | ✅ | ❌ | ✅ |
| **Content Management** | ❌ | ✅ | ❌ | ✅ |
| **Support Tickets** | ✅ Own | ✅ Own | ✅ All | ✅ All |
| **User Lookup** | ❌ | ❌ | ✅ | ✅ |
| **Platform Analytics** | ❌ | ❌ | ❌ | ✅ |
| **Revenue Reports** | ❌ | ✅ Own | ❌ | ✅ All |
| **Moderation Tools** | ❌ | ❌ | ❌ | ✅ |

---

## 🔄 Support Workflow

### Technical Issue Flow

```
User Reports Issue
        ↓
Support Staff Receives Ticket
        ↓
    Is it technical?
    ├─ Yes → Support handles
    └─ No (content-related) → Redirect to Creator
        ↓
    Can Support resolve?
    ├─ Yes → Close ticket
    └─ No → Escalate to Admin
```

### Content Issue Flow

```
User Reports Book Issue
        ↓
System Routes to Creator
        ↓
Creator Responds
        ↓
    Issue resolved?
    ├─ Yes → Close
    └─ No → Creator escalates to Admin
```

---

## 🎨 Dashboard URLs

| Role | URL | Icon |
|------|-----|------|
| Learner/Reader | `/dashboard` | 📊 |
| Teacher/Creator/Educator | `/creator` | 💼 |
| Support Staff | `/support` | 🛠️ |
| System Administrator | `/admin` | 🔧 |

---

## 📝 Role Assignment

**Default Registration:**

- New users → **Learner/Reader**
- Must apply for Creator status
- Support/Admin assigned by Admin

**Creator Application:**

- Submit profile
- Provide credentials
- Admin approval required
- 75% revenue share agreement

**Support Assignment:**

- Hired by platform
- Admin creates account
- Training required
- Limited privileges

---

## 💡 Best Practices

### For Learners

- Keep payment methods updated
- Track spending with dashboard
- Report issues promptly
- Review books fairly

### For Creators

- Respond to book issues within 24h
- Monitor earnings regularly
- Keep content updated
- Engage with learners

### For Support

- Route content issues to creators
- Escalate complex technical issues
- Document all interactions
- Follow SLA guidelines

### For Admins

- Monitor platform health
- Review creator applications
- Handle escalations promptly
- Maintain content standards

---

## 🔒 Security Considerations

**Authentication:**

- All roles require login
- Role-based access control (RBAC)
- Session management
- 2FA available for Creators/Admin

**Data Privacy:**

- Users see only their data
- Support has limited view rights
- Admin access logged
- GDPR compliance

**Payment Security:**

- PCI DSS compliant
- Encrypted transactions
- Secure payout processing
- Audit trail maintained

---

## 📈 Future Enhancements

- [ ] Moderator role (content review)
- [ ] Super Learner (community helpers)
- [ ] Partner role (organizations)
- [ ] Automated ticket routing
- [ ] Role-based notifications
- [ ] Permission customization
- [ ] Multi-role accounts

---

## ✅ Current Status

**Implemented:**

- ✅ Learner Dashboard
- ✅ Creator Dashboard
- ✅ Admin Dashboard
- ⏳ Support Dashboard (in progress)

**Pending:**

- [ ] Role-based authentication
- [ ] Permission enforcement
- [ ] Ticket system
- [ ] Creator application flow
- [ ] Support ticket routing
