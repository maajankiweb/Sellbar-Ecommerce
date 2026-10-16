# Sellbar — Secrets Rotation & Git History Purge Runbook

**Target Product:** Sellbar (`https://sellbar.in`)  
**Security Classification:** Critical Operations Runbook  
**Target Audience:** DevOps Engineer / Client Infrastructure Lead  

---

## 1. Incident Overview & Immediate Threat Assessment

During Phase 0 code auditing of the public repository `maajankiweb/Sellbar-Ecommerce`, default credentials and a master API key were identified as having been committed in early repository history and published in the project README:
- A legacy master key: `___LEGACY_Sellbar_MASTER_API_KEY___` (formatted `sellbar_live_sk_master_...`)
- Seed super administrator credentials (`admin@sellbar.in` with default static password)
- Development MongoDB connection strings and default JWT secrets

> [!CAUTION]
> **COMPROMISE ASSUMPTION**: Any secret that has ever been pushed to a remote GitHub repository must be treated as permanently compromised. Automated scrapers monitor public commits continuously. Simply removing a secret in a subsequent commit does **not** protect your production infrastructure because historical commits remain browsable and cloneable.

---

## 2. Mandatory Production Rotation Steps (Immediate Execution)

The following rotation procedures must be performed directly on your production environment and provider dashboards:

### 2.1 Rotate Super Admin Credentials in MongoDB
Connect to the production MongoDB instance via `mongosh` and change the administrator password immediately:
```javascript
// Connect to MongoDB
use sellbar_prod;

// Check existing admin accounts
db.users.find({ roles: "super_admin" }, { email: 1, roles: 1, status: 1 });

// Invalidate all active sessions across all users immediately
db.sessions.deleteMany({});
```
Run the hardened seed command on your secure production server using an environment variable password (never hardcoded):
```bash
ADMIN_EMAIL="admin@sellbar.in" ADMIN_PASSWORD="<GENERATE_SECURE_RANDOM_PASSWORD>" npm run seed:admin
```

### 2.2 Rotate JWT & OTP Cryptographic Secrets
Generate fresh, high-entropy 256-bit secrets using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Update your production `.env` (or Docker Compose / Coolify environment) with:
- `JWT_ACCESS_SECRET`: Fresh 64-character hex string
- `JWT_REFRESH_SECRET`: Fresh 64-character hex string
- `OTP_HMAC_SECRET`: Fresh 32-character hex string
- `FIELD_ENCRYPTION_KEY`: Fresh 32-character hex string

### 2.3 Rotate Third-Party Provider Keys
1. **Razorpay Dashboard (https://dashboard.razorpay.com):**
   - Navigate to Settings → API Keys → Regenerate Key Secret.
   - Set up Webhooks with a fresh random `RAZORPAY_WEBHOOK_SECRET`.
2. **MSG91 Dashboard (https://control.msg91.com):**
   - Invalidate existing AuthKey; generate a new AuthKey restricted to your production server IP.
   - Ensure DLT Sender ID `SLLBAR` is bound to your verified company entity.
3. **Cloudflare R2 Dashboard:**
   - Invalidate any old R2 API tokens; issue new scoped Read/Write credentials for your private and public buckets.

---

## 3. Git History Purge (`git-filter-repo`)

To permanently erase compromised secrets from the repository commit history:

### Step 1: Install `git-filter-repo`
```bash
# Via Python pip
pip install git-filter-repo
```

### Step 2: Create a Fresh Mirror Clone
```bash
git clone --bare https://github.com/maajankiweb/Sellbar-Ecommerce.git sellbar-repo-scrub
cd sellbar-repo-scrub
```

### Step 3: Define Expressions to Scrub
Create a file named `scrub-expressions.txt`:
```
sellbar_live_sk_master_===>[SCRUBBED_API_KEY]
SuperAdminPassword123!===>[SCRUBBED_PASSWORD]
```

### Step 4: Execute History Rewrite
```bash
git-filter-repo --replace-text scrub-expressions.txt
```

### Step 5: Force Push Rewritten History
Notify all collaborators to re-clone the repository, then force push the cleaned history:
```bash
git remote add origin https://github.com/maajankiweb/Sellbar-Ecommerce.git
git push origin --force --all
git push origin --force --tags
```
