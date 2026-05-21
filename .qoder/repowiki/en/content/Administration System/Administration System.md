# Administration System

<cite>
**Referenced Files in This Document**
- [admin/server.js](file://admin/server.js)
- [backend/controllers/adminController.js](file://backend/controllers/adminController.js)
- [backend/routes/adminRoutes.js](file://backend/routes/adminRoutes.js)
- [backend/middleware/authMiddleware.js](file://backend/middleware/authMiddleware.js)
- [backend/services/walletService.js](file://backend/services/walletService.js)
- [backend/models/AuditLog.js](file://backend/models/AuditLog.js)
- [backend/models/User.js](file://backend/models/User.js)
- [frontend/src/pages/AdminDashboard.tsx](file://frontend/src/pages/AdminDashboard.tsx)
- [frontend/src/pages/AdminBookManagement.tsx](file://frontend/src/pages/AdminBookManagement.tsx)
- [frontend/src/pages/AdminSellerManagement.tsx](file://frontend/src/pages/AdminSellerManagement.tsx)
- [frontend/src/pages/AdminWalletManagement.tsx](file://frontend/src/pages/AdminWalletManagement.tsx)
- [frontend/src/pages/AdminPayoutManagement.tsx](file://frontend/src/pages/AdminPayoutManagement.tsx)
- [frontend/src/pages/SystemSettings.tsx](file://frontend/src/pages/SystemSettings.tsx)
- [frontend/src/pages/AdminPromotions.tsx](file://frontend/src/pages/AdminPromotions.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the administration system that provides platform oversight and management capabilities across the QuantumMint bookstore ecosystem. It covers the admin dashboard, user and seller management, content moderation workflows, financial controls (wallets and payouts), system settings, and monitoring. It also explains role-based access control, bulk operations, and administrative auditing.

## Project Structure
The administration system spans three layers:
- Frontend admin UI pages that orchestrate administrative tasks via API calls
- Backend routes and controllers implementing admin workflows and enforcing RBAC
- Supporting services and models for wallet operations, audit logging, and user roles

```mermaid
graph TB
subgraph "Frontend Admin Pages"
AD["AdminDashboard.tsx"]
ABM["AdminBookManagement.tsx"]
ASM["AdminSellerManagement.tsx"]
AWM["AdminWalletManagement.tsx"]
APM["AdminPayoutManagement.tsx"]
ASP["AdminPromotions.tsx"]
SS["SystemSettings.tsx"]
end
subgraph "Backend API"
AR["adminRoutes.js"]
AC["adminController.js"]
AMW["authMiddleware.js"]
WS["walletService.js"]
AL["AuditLog.js"]
UM["User.js"]
end
subgraph "Admin Dashboard Service"
ADS["admin/server.js"]
end
AD --> AR
ABM --> AR
ASM --> AR
AWM --> AR
APM --> AR
ASP --> AR
SS --> AR
AR --> AC
AC --> AMW
AC --> WS
AC --> AL
AC --> UM
```

**Diagram sources**
- [frontend/src/pages/AdminDashboard.tsx](file://frontend/src/pages/AdminDashboard.tsx)
- [frontend/src/pages/AdminBookManagement.tsx](file://frontend/src/pages/AdminBookManagement.tsx)
- [frontend/src/pages/AdminSellerManagement.tsx](file://frontend/src/pages/AdminSellerManagement.tsx)
- [frontend/src/pages/AdminWalletManagement.tsx](file://frontend/src/pages/AdminWalletManagement.tsx)
- [frontend/src/pages/AdminPayoutManagement.tsx](file://frontend/src/pages/AdminPayoutManagement.tsx)
- [frontend/src/pages/AdminPromotions.tsx](file://frontend/src/pages/AdminPromotions.tsx)
- [frontend/src/pages/SystemSettings.tsx](file://frontend/src/pages/SystemSettings.tsx)
- [backend/routes/adminRoutes.js](file://backend/routes/adminRoutes.js)
- [backend/controllers/adminController.js](file://backend/controllers/adminController.js)
- [backend/middleware/authMiddleware.js](file://backend/middleware/authMiddleware.js)
- [backend/services/walletService.js](file://backend/services/walletService.js)
- [backend/models/AuditLog.js](file://backend/models/AuditLog.js)
- [backend/models/User.js](file://backend/models/User.js)
- [admin/server.js](file://admin/server.js)

**Section sources**
- [admin/server.js:1-40](file://admin/server.js#L1-L40)
- [backend/routes/adminRoutes.js:1-107](file://backend/routes/adminRoutes.js#L1-L107)
- [backend/controllers/adminController.js:1-599](file://backend/controllers/adminController.js#L1-L599)
- [backend/middleware/authMiddleware.js:1-36](file://backend/middleware/authMiddleware.js#L1-L36)
- [backend/services/walletService.js:1-80](file://backend/services/walletService.js#L1-L80)
- [backend/models/AuditLog.js:1-30](file://backend/models/AuditLog.js#L1-L30)
- [backend/models/User.js:1-50](file://backend/models/User.js#L1-L50)
- [frontend/src/pages/AdminDashboard.tsx:1-311](file://frontend/src/pages/AdminDashboard.tsx#L1-L311)
- [frontend/src/pages/AdminBookManagement.tsx:1-344](file://frontend/src/pages/AdminBookManagement.tsx#L1-L344)
- [frontend/src/pages/AdminSellerManagement.tsx:1-171](file://frontend/src/pages/AdminSellerManagement.tsx#L1-L171)
- [frontend/src/pages/AdminWalletManagement.tsx:1-287](file://frontend/src/pages/AdminWalletManagement.tsx#L1-L287)
- [frontend/src/pages/AdminPayoutManagement.tsx:1-169](file://frontend/src/pages/AdminPayoutManagement.tsx#L1-L169)
- [frontend/src/pages/SystemSettings.tsx:1-245](file://frontend/src/pages/SystemSettings.tsx#L1-L245)
- [frontend/src/pages/AdminPromotions.tsx:1-247](file://frontend/src/pages/AdminPromotions.tsx#L1-L247)

## Core Components
- Admin dashboard: Overview cards, quick navigation, recent audit logs, and system health polling
- Content moderation: Approve/reject books, bulk moderation, and rejection reasons
- Seller management: Approve/reject marketplace creators, set commission rates, revoke access
- Wallet management: Adjust user balances (credits/debits), change user roles
- Payout processing: Approve or reject creator withdrawal requests with rejection reasons
- Promotions: Gift books to individuals or all users
- System settings: Global toggles, payment provider switches, exchange rate, and reset controls
- Audit logging: Centralized admin action logging with filters
- Role-based access control: JWT-based auth plus admin role enforcement

**Section sources**
- [frontend/src/pages/AdminDashboard.tsx:27-311](file://frontend/src/pages/AdminDashboard.tsx#L27-L311)
- [backend/controllers/adminController.js:25-599](file://backend/controllers/adminController.js#L25-L599)
- [backend/routes/adminRoutes.js:10-107](file://backend/routes/adminRoutes.js#L10-L107)
- [backend/middleware/authMiddleware.js:27-33](file://backend/middleware/authMiddleware.js#L27-L33)
- [backend/models/AuditLog.js:4-26](file://backend/models/AuditLog.js#L4-L26)
- [frontend/src/pages/AdminBookManagement.tsx:20-344](file://frontend/src/pages/AdminBookManagement.tsx#L20-L344)
- [frontend/src/pages/AdminSellerManagement.tsx:22-171](file://frontend/src/pages/AdminSellerManagement.tsx#L22-L171)
- [frontend/src/pages/AdminWalletManagement.tsx:22-287](file://frontend/src/pages/AdminWalletManagement.tsx#L22-L287)
- [frontend/src/pages/AdminPayoutManagement.tsx:19-169](file://frontend/src/pages/AdminPayoutManagement.tsx#L19-L169)
- [frontend/src/pages/AdminPromotions.tsx:20-247](file://frontend/src/pages/AdminPromotions.tsx#L20-L247)
- [frontend/src/pages/SystemSettings.tsx:9-245](file://frontend/src/pages/SystemSettings.tsx#L9-L245)

## Architecture Overview
The admin system enforces role-based access control at the route level, delegates business logic to controllers, persists audit trails, and coordinates with wallet services for financial operations.

```mermaid
sequenceDiagram
participant UI as "Admin UI Page"
participant R as "adminRoutes.js"
participant MW as "authMiddleware.js"
participant C as "adminController.js"
participant W as "walletService.js"
participant DB as "Database"
UI->>R : HTTP Request (JWT Bearer)
R->>MW : authenticateToken()
MW-->>R : Decoded JWT with user
R->>MW : isAdmin()
MW-->>R : Access granted (role=admin)
R->>C : Invoke handler (e.g., updateBookStatus)
C->>DB : Read/Write Entities (User, Book, Transaction, AuditLog)
C->>W : creditWallet(...) (when needed)
W->>DB : Atomic balance update
C-->>UI : JSON response
```

**Diagram sources**
- [backend/routes/adminRoutes.js:7-8](file://backend/routes/adminRoutes.js#L7-L8)
- [backend/middleware/authMiddleware.js:3-25](file://backend/middleware/authMiddleware.js#L3-L25)
- [backend/middleware/authMiddleware.js:27-33](file://backend/middleware/authMiddleware.js#L27-L33)
- [backend/controllers/adminController.js:102-130](file://backend/controllers/adminController.js#L102-L130)
- [backend/services/walletService.js:64-79](file://backend/services/walletService.js#L64-L79)

## Detailed Component Analysis

### Admin Dashboard
- Displays pending seller/book counts, platform revenue, and active sellers
- Provides quick links to management modules
- Shows recent audit log entries with filtering by action and target
- Polls system health every 30 seconds

```mermaid
flowchart TD
Start(["Load AdminDashboard"]) --> FetchStats["Fetch admin stats"]
FetchStats --> RenderCards["Render overview cards"]
RenderCards --> Nav["Navigate to modules"]
RenderCards --> Logs["Fetch audit logs (filterable)"]
RenderCards --> Health["Poll health (every 30s)"]
Logs --> End(["Render recent actions"])
Health --> End
Nav --> End
```

**Diagram sources**
- [frontend/src/pages/AdminDashboard.tsx:32-46](file://frontend/src/pages/AdminDashboard.tsx#L32-L46)
- [frontend/src/pages/AdminDashboard.tsx:144-223](file://frontend/src/pages/AdminDashboard.tsx#L144-L223)
- [frontend/src/pages/AdminDashboard.tsx:257-278](file://frontend/src/pages/AdminDashboard.tsx#L257-L278)

**Section sources**
- [frontend/src/pages/AdminDashboard.tsx:27-311](file://frontend/src/pages/AdminDashboard.tsx#L27-L311)

### Content Moderation Workflow
- Lists books grouped by status (pending/approved/rejected)
- Approve or reject individual books with rejection reasons
- Bulk approve/reject multiple books atomically
- Records audit logs for each moderation action

```mermaid
sequenceDiagram
participant UI as "AdminBookManagement.tsx"
participant R as "adminRoutes.js"
participant C as "adminController.js"
participant DB as "Database"
UI->>R : GET /api/admin/books
R->>C : getAllBooks()
C->>DB : SELECT Book + Seller + User
C-->>UI : Books[]
UI->>R : PUT /api/admin/books/ : id/status {status,rejectionReason}
R->>C : updateBookStatus()
C->>DB : UPDATE Book SET status, rejectionReason
C->>DB : INSERT AuditLog
C-->>UI : {success, book}
UI->>R : POST /api/admin/books/bulk-status {ids,status,rejectionReason}
R->>C : bulkUpdateBookStatus()
C->>DB : UPDATE Book WHERE id IN (...)
C->>DB : INSERT AuditLog (multiple)
C-->>UI : {success, count}
```

**Diagram sources**
- [backend/routes/adminRoutes.js:22-38](file://backend/routes/adminRoutes.js#L22-L38)
- [backend/controllers/adminController.js:83-161](file://backend/controllers/adminController.js#L83-L161)
- [backend/models/AuditLog.js:4-26](file://backend/models/AuditLog.js#L4-L26)

**Section sources**
- [frontend/src/pages/AdminBookManagement.tsx:20-344](file://frontend/src/pages/AdminBookManagement.tsx#L20-L344)
- [backend/controllers/adminController.js:83-161](file://backend/controllers/adminController.js#L83-L161)
- [backend/routes/adminRoutes.js:22-38](file://backend/routes/adminRoutes.js#L22-L38)

### Seller Management Workflow
- Lists sellers grouped by status (pending/approved/rejected)
- Approve or reject seller applications
- Set commission rates during approval
- Revoking access transitions approved → pending

```mermaid
sequenceDiagram
participant UI as "AdminSellerManagement.tsx"
participant R as "adminRoutes.js"
participant C as "adminController.js"
participant DB as "Database"
UI->>R : GET /api/admin/sellers
R->>C : getAllSellers()
C->>DB : SELECT Seller + User
C-->>UI : Sellers[]
UI->>R : PUT /api/admin/sellers/ : id/status {status, commissionRate}
R->>C : updateSellerStatus()
C->>DB : UPDATE Seller SET status, commissionRate
C->>DB : IF approved -> UPDATE User SET role=seller
C->>DB : INSERT AuditLog
C-->>UI : {success, seller}
```

**Diagram sources**
- [backend/routes/adminRoutes.js:10-20](file://backend/routes/adminRoutes.js#L10-L20)
- [backend/controllers/adminController.js:25-78](file://backend/controllers/adminController.js#L25-L78)
- [backend/models/User.js:26-28](file://backend/models/User.js#L26-L28)

**Section sources**
- [frontend/src/pages/AdminSellerManagement.tsx:22-171](file://frontend/src/pages/AdminSellerManagement.tsx#L22-L171)
- [backend/controllers/adminController.js:25-78](file://backend/controllers/adminController.js#L25-L78)
- [backend/routes/adminRoutes.js:10-20](file://backend/routes/adminRoutes.js#L10-L20)

### Wallet Management and User Roles
- Lists users with balances and roles
- Adjusts user wallet balances (credits/debits) with descriptions
- Updates user roles (learner/seller/admin)
- Records audit logs for adjustments and role changes

```mermaid
sequenceDiagram
participant UI as "AdminWalletManagement.tsx"
participant R as "adminRoutes.js"
participant C as "adminController.js"
participant DB as "Database"
UI->>R : GET /api/admin/users
R->>C : getAllUsers()
C->>DB : SELECT User (balances, roles)
C-->>UI : Users[]
UI->>R : POST /api/admin/users/adjust-balance {userId, amount, currency, description}
R->>C : adjustUserBalance()
C->>DB : UPDATE User balances
C->>DB : INSERT Transaction
C->>DB : INSERT AuditLog
C-->>UI : {success, balance}
UI->>R : PUT /api/admin/users/role {userId, role}
R->>C : updateUserRole()
C->>DB : UPDATE User SET role
C->>DB : INSERT AuditLog
C-->>UI : {success, role}
```

**Diagram sources**
- [backend/routes/adminRoutes.js:40-56](file://backend/routes/adminRoutes.js#L40-L56)
- [backend/controllers/adminController.js:166-256](file://backend/controllers/adminController.js#L166-L256)
- [backend/models/User.js:30-37](file://backend/models/User.js#L30-L37)

**Section sources**
- [frontend/src/pages/AdminWalletManagement.tsx:22-287](file://frontend/src/pages/AdminWalletManagement.tsx#L22-L287)
- [backend/controllers/adminController.js:166-256](file://backend/controllers/adminController.js#L166-L256)
- [backend/routes/adminRoutes.js:40-56](file://backend/routes/adminRoutes.js#L40-L56)

### Payout Processing
- Lists pending withdrawal requests
- Approve or reject payouts
- On rejection, refunds the user’s balance atomically
- Records audit logs for each payout action

```mermaid
sequenceDiagram
participant UI as "AdminPayoutManagement.tsx"
participant R as "adminRoutes.js"
participant C as "adminController.js"
participant W as "walletService.js"
participant DB as "Database"
UI->>R : GET /api/admin/payouts
R->>C : getPayoutRequests()
C->>DB : SELECT Transactions WHERE type=withdrawal AND status=processing
C-->>UI : Payouts[]
UI->>R : PUT /api/admin/payouts/ : id {status, rejectionReason}
R->>C : processPayout()
alt status=approved
C->>DB : UPDATE Transaction SET status=completed
else status=failed
C->>W : creditWallet(sequelize, userId, amount, currency)
W->>DB : UPDATE Users SET balance += amount
C->>DB : UPDATE Transaction SET status=failed, description
end
C->>DB : INSERT AuditLog
C-->>UI : {success, transaction}
```

**Diagram sources**
- [backend/routes/adminRoutes.js:76-86](file://backend/routes/adminRoutes.js#L76-L86)
- [backend/controllers/adminController.js:362-425](file://backend/controllers/adminController.js#L362-L425)
- [backend/services/walletService.js:64-79](file://backend/services/walletService.js#L64-L79)

**Section sources**
- [frontend/src/pages/AdminPayoutManagement.tsx:19-169](file://frontend/src/pages/AdminPayoutManagement.tsx#L19-L169)
- [backend/controllers/adminController.js:362-425](file://backend/controllers/adminController.js#L362-L425)
- [backend/routes/adminRoutes.js:76-86](file://backend/routes/adminRoutes.js#L76-L86)

### Promotions and Gifts
- Select recipients (individual/all users)
- Choose an approved book to gift
- Optionally add internal messaging
- Creates purchase records for recipients

```mermaid
sequenceDiagram
participant UI as "AdminPromotions.tsx"
participant R as "adminRoutes.js"
participant C as "adminController.js"
participant DB as "Database"
UI->>R : POST /api/admin/gift-book {bookId, userId?, recipientType, message}
R->>C : giftBook()
C->>DB : SELECT Book
alt recipientType=all
C->>DB : SELECT Users
C->>DB : INSERT Purchase for each User
else recipientType=individual
C->>DB : INSERT Purchase for userId
end
C->>DB : INSERT AuditLog
C-->>UI : {success, message}
```

**Diagram sources**
- [backend/routes/adminRoutes.js:88-92](file://backend/routes/adminRoutes.js#L88-L92)
- [backend/controllers/adminController.js:427-479](file://backend/controllers/adminController.js#L427-L479)

**Section sources**
- [frontend/src/pages/AdminPromotions.tsx:20-247](file://frontend/src/pages/AdminPromotions.tsx#L20-L247)
- [backend/controllers/adminController.js:427-479](file://backend/controllers/adminController.js#L427-L479)
- [backend/routes/adminRoutes.js:88-92](file://backend/routes/adminRoutes.js#L88-L92)

### System Settings Management
- General configuration: site name, maintenance mode, registrations
- Financial settings: withdrawal fee %, exchange rate, payment providers
- AI services: default TTS model and feature enablement
- Security/danger zone: reset platform data and cache clearing

```mermaid
flowchart TD
Start(["Open SystemSettings"]) --> Load["Load current settings"]
Load --> Edit["Edit toggles and values"]
Edit --> Save["Save settings"]
Save --> Apply["Apply to store"]
Apply --> End(["Success"])
```

**Diagram sources**
- [frontend/src/pages/SystemSettings.tsx:9-245](file://frontend/src/pages/SystemSettings.tsx#L9-L245)

**Section sources**
- [frontend/src/pages/SystemSettings.tsx:9-245](file://frontend/src/pages/SystemSettings.tsx#L9-L245)

### Role-Based Access Control
- Authentication middleware verifies JWT and attaches user
- Admin middleware checks role=admin before allowing admin routes
- Routes enforce protection at mount time

```mermaid
flowchart TD
Req["Incoming Request"] --> HasToken{"Has Bearer token?"}
HasToken -- No --> Deny401["401 Unauthorized"]
HasToken -- Yes --> Verify["Verify JWT (HS256)"]
Verify --> Attach["Attach user to req"]
Attach --> IsAdmin{"role == admin?"}
IsAdmin -- No --> Deny403["403 Forbidden"]
IsAdmin -- Yes --> Next["Proceed to controller"]
```

**Diagram sources**
- [backend/middleware/authMiddleware.js:3-33](file://backend/middleware/authMiddleware.js#L3-L33)

**Section sources**
- [backend/middleware/authMiddleware.js:1-36](file://backend/middleware/authMiddleware.js#L1-L36)
- [backend/routes/adminRoutes.js:7-8](file://backend/routes/adminRoutes.js#L7-L8)

### Audit Logging
- Centralized logging of admin actions with action type, target, and details
- Supports filtering by action and targetId
- Used across moderation, wallet, roles, payouts, and promotions

```mermaid
erDiagram
AUDIT_LOG {
uuid id PK
uuid adminId
string action
string targetId
json details
}
USER {
uuid id PK
string email
string name
enum role
}
AUDIT_LOG }o--|| USER : "adminId -> User.id"
```

**Diagram sources**
- [backend/models/AuditLog.js:4-26](file://backend/models/AuditLog.js#L4-L26)
- [backend/models/User.js:5-9](file://backend/models/User.js#L5-L9)

**Section sources**
- [backend/controllers/adminController.js:8-20](file://backend/controllers/adminController.js#L8-L20)
- [backend/controllers/adminController.js:307-333](file://backend/controllers/adminController.js#L307-L333)
- [backend/models/AuditLog.js:1-30](file://backend/models/AuditLog.js#L1-L30)

### Wallet Management Internals
- Atomic balance updates via SQL increment to prevent race conditions
- Exchange rate fallback and live rate integration
- Transaction history pagination and filtering

```mermaid
flowchart TD
Start(["Credit Wallet"]) --> Validate["Validate amount and currency"]
Validate --> Update["UPDATE Users SET balance += amount"]
Update --> Affected{"Affected rows > 0?"}
Affected -- Yes --> Done(["Success"])
Affected -- No --> Err(["User not found or update failed"])
```

**Diagram sources**
- [backend/services/walletService.js:64-79](file://backend/services/walletService.js#L64-L79)

**Section sources**
- [backend/services/walletService.js:1-80](file://backend/services/walletService.js#L1-L80)

## Dependency Analysis
- Controllers depend on models and services for business logic
- Routes depend on middleware for auth and admin checks
- UI pages depend on API endpoints exposed by admin routes
- Audit logs are a cross-cutting concern used by multiple controllers

```mermaid
graph LR
AR["adminRoutes.js"] --> AC["adminController.js"]
AC --> AMW["authMiddleware.js"]
AC --> WS["walletService.js"]
AC --> AL["AuditLog.js"]
AC --> UM["User.js"]
UI["Admin UI Pages"] --> AR
```

**Diagram sources**
- [backend/routes/adminRoutes.js:1-107](file://backend/routes/adminRoutes.js#L1-L107)
- [backend/controllers/adminController.js:1-599](file://backend/controllers/adminController.js#L1-L599)
- [backend/middleware/authMiddleware.js:1-36](file://backend/middleware/authMiddleware.js#L1-L36)
- [backend/services/walletService.js:1-80](file://backend/services/walletService.js#L1-L80)
- [backend/models/AuditLog.js:1-30](file://backend/models/AuditLog.js#L1-L30)
- [backend/models/User.js:1-50](file://backend/models/User.js#L1-L50)

**Section sources**
- [backend/routes/adminRoutes.js:1-107](file://backend/routes/adminRoutes.js#L1-L107)
- [backend/controllers/adminController.js:1-599](file://backend/controllers/adminController.js#L1-L599)

## Performance Considerations
- Use bulk operations for moderation and promotions to minimize round-trips
- Paginate audit logs and user lists to avoid large payloads
- Debounce search/filter inputs in admin UI to reduce unnecessary queries
- Cache frequently accessed stats (pending counts) on the client side with short TTLs
- Ensure atomic wallet updates to prevent race conditions and maintain consistency

## Troubleshooting Guide
- Authentication failures: Verify JWT presence and HS256 validity; ensure Authorization header format
- Access denied: Confirm user role is admin; check middleware chain
- Audit logs missing: Ensure recordAuditLog is invoked after successful operations
- Payout rejections: Verify user exists and balance update succeeds; confirm transaction status transitions
- Wallet adjustments: Validate amount numeric and currency selection; confirm atomic update succeeded

**Section sources**
- [backend/middleware/authMiddleware.js:3-25](file://backend/middleware/authMiddleware.js#L3-L25)
- [backend/middleware/authMiddleware.js:27-33](file://backend/middleware/authMiddleware.js#L27-L33)
- [backend/controllers/adminController.js:8-20](file://backend/controllers/adminController.js#L8-L20)
- [backend/controllers/adminController.js:394-410](file://backend/controllers/adminController.js#L394-L410)
- [backend/services/walletService.js:64-79](file://backend/services/walletService.js#L64-L79)

## Conclusion
The administration system provides a comprehensive suite of tools for platform oversight, governance, and financial control. It enforces strict RBAC, maintains a complete audit trail, and offers efficient bulk operations for scalable moderation and promotions. The modular design allows administrators to manage content, users, finances, and system settings through a cohesive interface backed by robust backend services.

## Appendices

### Administrative Workflows Examples
- Approve a new seller:
  - Navigate to seller management, select “approve,” optionally set commission rate, save
  - On success, user role upgrades to seller automatically
- Moderate content:
  - Open content moderation, choose pending books, approve or reject with reason
  - Bulk actions supported for efficiency
- Process a payout:
  - Open payouts, approve or reject with optional reason
  - Rejected payouts are refunded atomically to the user’s balance
- Gift books:
  - Choose recipient type, select an approved book, optionally add a message
  - Dispatch gift; recipients receive free purchase records

[No sources needed since this section summarizes workflows without analyzing specific files]