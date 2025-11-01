# YoForex AI - Troubleshooting Guide

**Common issues and their solutions. Get back to trading quickly!**

---

## Table of Contents

1. [Login Problems](#login-problems)
2. [API Errors](#api-errors)
3. [Analysis Issues](#analysis-issues)
4. [Payment Problems](#payment-problems)
5. [UI/Display Issues](#uidisplay-issues)
6. [Common Error Messages](#common-error-messages)
7. [Browser Issues](#browser-issues)
8. [Performance Issues](#performance-issues)
9. [Mobile App Issues](#mobile-app-issues)
10. [When to Contact Support](#when-to-contact-support)

---

## Login Problems

### Can't Login with Email/Password

**Symptoms:**
- "Invalid credentials" error
- "User not found" error
- Login button not responding
- Redirects back to login page

**Solutions:**

#### **Step 1: Check Your Credentials**
- ✅ Verify email address is correct (check for typos)
- ✅ Ensure password is correct (case-sensitive)
- ✅ Check if Caps Lock is ON
- ✅ Try copying and pasting password from password manager

#### **Step 2: Reset Your Password**
1. Click "Forgot Password?" on login page
2. Enter your registered email
3. Check inbox (and spam folder)
4. Click reset link in email
5. Create new password
6. Try logging in again

#### **Step 3: Clear Browser Data**
```
Chrome:
1. Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
2. Select "Cookies and other site data"
3. Select "Cached images and files"
4. Click "Clear data"
5. Restart browser
6. Try logging in again

Firefox:
1. Press Ctrl+Shift+Delete
2. Select "Cookies" and "Cache"
3. Click "Clear Now"
4. Restart browser

Safari:
1. Safari → Preferences → Privacy
2. Click "Manage Website Data"
3. Find yoforexai.com and remove
4. Restart Safari
```

#### **Step 4: Try Different Browser**
- If Chrome doesn't work, try Firefox
- Try Incognito/Private mode (rules out extension issues)

#### **Step 5: Check Account Status**
Your account may be:
- Not verified (check email for verification link)
- Suspended (contact support)
- Deleted (create new account)

**Still Can't Login?**
- Try "Login with WhatsApp" instead (no password needed)
- Contact support: support@yoforex.net with your email address

---

### OTP Not Received

**Symptoms:**
- OTP not arriving via SMS
- WhatsApp OTP not received
- Verification code delayed

**Solutions:**

#### **SMS OTP Issues**

**Wait 2-3 Minutes:**
- SMS can be delayed by network
- Check both SMS inbox and blocked messages
- Ensure phone has signal

**Check Phone Number:**
- Verify country code is correct (+91 for India)
- Ensure no spaces or special characters
- Number should be active and receiving messages

**Request New OTP:**
1. Wait 60 seconds (cooldown period)
2. Click "Resend OTP"
3. Choose SMS or WhatsApp
4. Wait up to 5 minutes

**Still Not Received?**
- Check if you have SMS blocking enabled
- Verify phone number is correct
- Try WhatsApp OTP instead
- Contact your mobile carrier

#### **WhatsApp OTP Issues**

**Check WhatsApp:**
- Ensure WhatsApp is installed and active
- Check if you're connected to internet
- Verify WhatsApp number matches entered number
- Look in WhatsApp chat list for "YoForex AI" or unknown number

**WhatsApp Not Active?**
- Use SMS OTP instead
- Or use Email/Password login

**Region Restrictions:**
Some countries may have restrictions on automated messages. Try:
- VPN to different region
- SMS instead of WhatsApp
- Email/password registration

---

### WhatsApp Login Not Working

**Symptoms:**
- OTP not received on WhatsApp
- "Invalid OTP" error
- WhatsApp login button not responding

**Solutions:**

#### **Step 1: Verify WhatsApp Setup**
- ✅ WhatsApp installed and active
- ✅ Internet connection working
- ✅ Phone number verified in WhatsApp
- ✅ Not using WhatsApp Business (use regular WhatsApp)

#### **Step 2: Check Phone Number**
- Entered with correct country code
- No spaces or special characters
- Number active on WhatsApp
- Same number used for WhatsApp account

#### **Step 3: Request Fresh OTP**
1. Go back to login page
2. Re-enter phone number carefully
3. Click "Send OTP via WhatsApp"
4. Check WhatsApp for new message
5. Enter 6-digit code quickly (10-minute expiry)

#### **Step 4: Alternative Login Methods**
If WhatsApp continues to fail:
- Use **SMS OTP** instead
- Use **Email/Password** login
- Create account with email if you don't have one

**Error: "WhatsApp Service Unavailable"**
- Our WhatsApp service may be temporarily down
- Use SMS or email login
- Check our status page or forum for updates

---

### Account Locked

**Symptoms:**
- "Account locked" or "Account suspended" message
- Can't login even with correct credentials
- Access denied error

**Reasons for Account Lock:**

1. **Too Many Failed Login Attempts** (Auto-lock for security)
   - **Duration**: 30 minutes
   - **Solution**: Wait 30 minutes, then try again
   - **Prevention**: Reset password if you forgot it

2. **Suspicious Activity Detected**
   - Multiple logins from different locations
   - Unusual API usage patterns
   - Potential security breach
   - **Solution**: Contact support immediately

3. **Terms of Service Violation**
   - Abusive behavior
   - Fraudulent activity
   - Multiple accounts (against ToS)
   - **Solution**: Contact support for review

4. **Payment Issues**
   - Chargeback filed
   - Fraudulent payment detected
   - **Solution**: Contact billing support

**How to Unlock:**

**Auto-Lock (Failed Logins):**
- Wait 30 minutes
- Or click "Forgot Password?" to reset
- Login with new password

**Manual Lock (Security/Violation):**
- Email: support@yoforex.net
- Subject: "Account Locked - [Your Email]"
- Explain situation
- Provide account details
- Wait for support response (24-48 hours)

**Prevent Future Locks:**
- Use strong, memorable password
- Enable 2FA for security
- Don't share account credentials
- Use password manager
- Logout from shared devices

---

## API Errors

### "Network Error" Message

**Symptoms:**
- "Network Error" or "Failed to fetch" message
- API calls timing out
- Data not loading
- Spinning loaders that never complete

**Causes & Solutions:**

#### **1. Internet Connection Issues**

**Check Your Connection:**
```
Test:
1. Open new tab
2. Visit google.com or other site
3. If it loads, internet is working

If internet is down:
- Check router/modem
- Restart your router
- Switch to mobile data
- Contact ISP
```

**Unstable Connection:**
- Weak WiFi signal → Move closer to router
- Mobile data issues → Switch to WiFi
- VPN interfering → Disconnect VPN temporarily

#### **2. Firewall/Security Software**

**Corporate Firewall:**
- May block trading platforms
- Request IT to whitelist: `*.yoforexai.com`
- Use mobile data as workaround

**Antivirus/Security Software:**
- May block API calls
- Temporarily disable to test
- Add yoforexai.com to exceptions
- Or try different browser

#### **3. Server Issues**

**Backend May Be Down:**
- Check our status page (if available)
- Visit community forum for updates
- Wait 10-15 minutes and retry
- If persists, contact support

#### **4. Browser Issues**

**Clear Browser Cache:**
```
1. Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
2. Select "Cached images and files"
3. Select "Cookies and other site data"
4. Clear last 24 hours or All time
5. Restart browser
```

**Try Incognito Mode:**
- Rules out extension interference
- If works in incognito, disable extensions one by one

#### **5. DNS Issues**

**Change DNS:**
```
Use Google DNS:
- Primary: 8.8.8.8
- Secondary: 8.8.4.4

Or Cloudflare DNS:
- Primary: 1.1.1.1
- Secondary: 1.0.0.1
```

**How to Change DNS** (varies by OS):
- Google "change DNS [your OS]"

---

### "Unauthorized" Error

**Symptoms:**
- "Unauthorized" or "401 Unauthorized" error
- Kicked out to login page
- "Authentication failed" message
- API calls returning 401

**Causes:**

1. **Session Expired** (Most Common)
2. **Invalid Token**
3. **Account Issue**

**Solutions:**

#### **Quick Fix: Re-login**
1. Logout completely
2. Clear browser cookies
3. Login again
4. Session refreshed

#### **If Keeps Happening:**

**Option 1: Clear All Cookies**
```
Chrome:
1. Settings → Privacy → Cookies
2. See all cookies → Find yoforexai.com
3. Remove all YoForex cookies
4. Restart browser
5. Login fresh
```

**Option 2: Try Different Browser**
- Chrome → Firefox
- Or use Incognito mode

**Option 3: Check Account Status**
- Subscription may have expired
- Account may be suspended
- Check email for notifications
- Login to dashboard to verify

#### **For Developers (API Users):**

**Check JWT Token:**
```javascript
// Token may be expired
// Check expiry:
const token = localStorage.getItem('token');
const decoded = jwt_decode(token);
console.log('Token expires:', new Date(decoded.exp * 1000));

// If expired, refresh token
```

**Ensure Authorization Header:**
```javascript
// Correct format:
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}

// Common mistakes:
❌ 'Authorization': 'YOUR_JWT_TOKEN'  // Missing "Bearer"
❌ 'Auth': 'Bearer YOUR_JWT_TOKEN'    // Wrong header name
```

---

### "Rate Limit Exceeded"

**Symptoms:**
- "Rate limit exceeded" or "429 Too Many Requests" error
- API calls blocked
- "Please try again later" message

**What It Means:**
You've made too many requests in a short time period.

**Rate Limits by Plan:**
- **Free**: 100 requests/hour
- **Pro**: 1,000 requests/hour
- **Max**: 5,000 requests/hour

**Solutions:**

#### **Wait and Retry**
- Wait 1 hour for limit to reset
- Limits reset on the hour (e.g., 3:00 PM, 4:00 PM)

#### **Reduce Request Frequency**
```javascript
// Bad: Rapid requests in loop
for (let i = 0; i < 100; i++) {
  await analyze(pair);  // Hits rate limit!
}

// Good: Batch or delay requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

for (let i = 0; i < 100; i++) {
  await analyze(pair);
  await delay(1000);  // 1 second between requests
}
```

#### **Check Your Code**
- Infinite loops making requests
- Accidental rapid refreshing
- Webhook misconfiguration
- Bug in automation script

#### **Upgrade Plan**
If you legitimately need more requests:
- Pro: 10x more requests than Free
- Max: 50x more requests than Free

---

### CORS Errors

**Symptoms:**
- "CORS policy" error in browser console
- "Access-Control-Allow-Origin" error
- API calls failing from your website/app

**What It Means:**
Cross-Origin Resource Sharing blocked by browser security.

**Who Gets This:**
- Developers integrating our API
- Not typical users on our website

**Solutions for Developers:**

#### **1. Use Correct API Domain**
```javascript
// Correct:
const API_URL = 'https://backend.yoforexai.com';

// Wrong (will cause CORS):
const API_URL = 'http://localhost:8000';  // Development backend
```

#### **2. Include Credentials**
```javascript
fetch('https://backend.yoforexai.com/api/analyze', {
  method: 'POST',
  credentials: 'include',  // Important!
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

#### **3. Use Axios with Config**
```javascript
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://backend.yoforexai.com';
```

#### **4. Backend Proxy (Development)**
If developing locally:
```javascript
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.yoforexai.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
}
```

#### **5. Contact Support**
If you're building an integration:
- Email: support@yoforex.net
- Subject: "API Integration - CORS Issue"
- We may whitelist your domain

---

## Analysis Issues

### Analysis Not Working

**Symptoms:**
- Click "Analyze" but nothing happens
- Spinning loader forever
- "Analysis failed" error
- No results displayed

**Solutions:**

#### **Step 1: Check Credits**
- You may have run out of monthly tokens
- Check dashboard: Account Summary → Available Credits
- If 0 credits remaining:
  - Wait for monthly reset (1st of month)
  - Or upgrade plan

#### **Step 2: Verify Inputs**
Ensure all required fields are selected:
- ✅ Currency pair selected
- ✅ Timeframe selected
- ✅ Strategy selected
- ✅ AI model selected (if applicable)

#### **Step 3: Check Market Hours**
Some pairs may have limited data:
- Major pairs: Always available
- Exotic pairs: May have gaps
- Weekends: Limited/no data
- Holidays: Reduced data

**Market Hours:**
- Forex markets closed: Saturday 10 PM GMT to Sunday 10 PM GMT
- If analyzing during weekend, expect limited results

#### **Step 4: Try Different Parameters**
- Change timeframe (try H1 or D1)
- Select different strategy
- Choose different AI model
- Try different pair

#### **Step 5: Clear Cache and Retry**
1. Clear browser cache
2. Refresh page
3. Try analysis again

#### **Step 6: Check Console for Errors**
(For technical users)
```
1. Press F12 to open DevTools
2. Go to Console tab
3. Run analysis again
4. Look for red errors
5. Screenshot and send to support
```

---

### No Results Returned

**Symptoms:**
- Analysis completes but shows empty results
- "No data available" message
- Results panel blank

**Causes & Solutions:**

#### **1. Selected Pair Has No Data**
- Exotic pairs may lack recent data
- Try major pair (EUR/USD, GBP/USD)
- Change timeframe to D1 or H1

#### **2. Market Closed**
- Weekend or holiday
- No new data to analyze
- Wait for market to open

**Market Hours:**
- Sunday 10 PM GMT to Friday 10 PM GMT
- Best liquidity: London/NY overlap (1 PM - 5 PM GMT)

#### **3. Backend Processing Error**
- Temporary server issue
- Wait 5 minutes and retry
- Try different pair/timeframe
- If persists, report to support

#### **4. Credits Exhausted Mid-Analysis**
- Analysis started but credits ran out
- Check available credits
- Top up or wait for reset

---

### Incorrect Data Shown

**Symptoms:**
- Entry/SL/TP prices seem wrong
- Confidence score doesn't make sense
- Charts showing outdated data
- Prices don't match market

**Solutions:**

#### **Check Data Timestamp**
- Look at analysis timestamp
- Data may be delayed (up to 1 minute)
- Refresh for latest data

#### **Verify Market Price**
- Compare with your broker's price
- Different brokers have slight price differences
- Our data: Aggregated from multiple sources

#### **Timeframe Mismatch**
- Ensure selected timeframe matches displayed chart
- D1 entry looks different than M15 entry
- This is normal and expected

#### **Not an Error:**
AI recommendations may differ from current price:
- Entry may be pending (wait for price to reach)
- SL/TP based on analysis, not current price
- Confidence reflects probability, not certainty

**If Data Is Genuinely Wrong:**
1. Screenshot the issue
2. Note: Pair, timeframe, strategy, timestamp
3. Email: support@yoforex.net
4. Subject: "Incorrect Data - [Pair] [Timeframe]"

---

### Slow Performance

**Symptoms:**
- Analysis takes >30 seconds
- Page loading slowly
- Laggy interface
- Timeouts

**Causes & Solutions:**

#### **1. Network Speed**
```
Test your speed:
- Visit speedtest.net
- Minimum recommended: 5 Mbps

If slow:
- Switch from WiFi to Ethernet
- Move closer to router
- Disconnect other devices
- Restart router
```

#### **2. AI Model Selection**
Different models have different speeds:
- **Fast**: Mistral, GPT-4o (3-5 seconds)
- **Medium**: Claude Sonnet, DeepSeek (5-10 seconds)
- **Slow**: Claude Opus, Grok (10-20 seconds)

**Solution**: Use faster models for quick checks

#### **3. Multi-AI Analysis**
- Runs multiple models simultaneously
- Takes longer (10-30 seconds)
- Expected behavior
- Trade-off: Accuracy vs. Speed

#### **4. Browser Performance**
```
Clear RAM by closing:
- Unused tabs
- Unused applications
- Resource-heavy extensions

Restart browser periodically
```

#### **5. Device Performance**
- Old device may struggle with charts
- Close background apps
- Increase available RAM
- Consider upgrade if persistent

#### **6. Peak Usage Times**
- Platform may be slower during peak hours
- Typically: US market open (2:30 PM - 5 PM GMT)
- Try off-peak for faster performance

**Optimize Performance:**
- Use faster AI models
- Close unused tabs
- Disable unnecessary browser extensions
- Use wired internet connection
- Upgrade to modern browser

---

## Payment Problems

### Payment Failed

**Symptoms:**
- "Payment failed" error
- Transaction declined
- Card not accepted
- Payment page error

**Solutions:**

#### **Card Payment Issues (Cashfree)**

**Check Card Details:**
- ✅ Card number correct (no typos)
- ✅ Expiry date correct (MM/YY format)
- ✅ CVV correct (3-4 digits on back)
- ✅ Name matches card exactly

**Common Causes:**
1. **Insufficient Funds**
   - Check account balance
   - Ensure credit limit available
   - Try different card

2. **Card Blocked/Restricted**
   - International transactions disabled → Contact bank to enable
   - Online payments disabled → Enable in banking app
   - Card expired → Use different card

3. **3D Secure Failed**
   - OTP not entered correctly
   - Timed out on OTP page
   - Retry and enter OTP quickly

4. **Daily Limit Exceeded**
   - Banks have daily spending limits
   - Wait 24 hours or contact bank to increase limit

**Solutions:**
- Try different payment method (UPI, Net Banking)
- Use different card
- Contact bank to authorize payment
- Try cryptocurrency payment

#### **UPI Payment Issues (India)**

**Check UPI Setup:**
- UPI PIN set correctly
- Bank account linked to UPI
- Sufficient balance
- UPI app working

**Common Errors:**
- **"Transaction failed"** → Retry after 5 minutes
- **"Bank server down"** → Try different bank account
- **"Declined by bank"** → Contact bank

**Solutions:**
- Retry payment
- Try different UPI app (PhonePe, Google Pay, Paytm)
- Use Net Banking instead
- Check with bank

#### **Cryptocurrency Payment Issues**

**Common Mistakes:**
1. **Sent Wrong Amount**
   - Must send EXACT amount shown
   - Blockchain fees deducted → Insufficient amount received
   - **Solution**: Send slightly more to account for fees

2. **Sent from Exchange**
   - Some exchanges don't support payment addresses
   - **Solution**: Use personal wallet (Trust Wallet, MetaMask)

3. **Wrong Cryptocurrency**
   - Sent BTC to ETH address (lost funds!)
   - **Solution**: ALWAYS verify cryptocurrency matches address

4. **Insufficient Confirmations**
   - Payment needs 1-3 blockchain confirmations
   - Bitcoin: ~10-60 minutes
   - Ethereum: ~3-15 minutes
   - **Solution**: Wait for confirmations, check blockchain explorer

**Crypto Payment Steps:**
1. Copy payment address (don't type manually!)
2. Select CORRECT cryptocurrency
3. Send EXACT amount + fees
4. Use personal wallet (not exchange)
5. Save transaction ID
6. Wait for confirmations
7. Subscription activates automatically

**If Payment Still Failing:**
- Take screenshot of error
- Email: support@yoforex.net
- Include: Payment method, amount, error message
- Transaction ID (if available)

---

### Payment Pending

**Symptoms:**
- Payment deducted but subscription not activated
- "Payment pending" status
- Money gone from account but no access

**What's Happening:**

**For Card/UPI:**
- Payment gateway processing (usually 5-30 minutes)
- Bank verification in progress
- Rare: Manual review required

**For Cryptocurrency:**
- Awaiting blockchain confirmations
- Bitcoin: 1-3 confirmations (10-60 min)
- Ethereum: 12 confirmations (3-15 min)
- Other coins: Varies

**What To Do:**

#### **Step 1: Wait**
- Card/UPI: Wait 30 minutes
- Crypto: Check confirmations on blockchain explorer
- Most payments clear automatically

#### **Step 2: Check Email**
- Payment confirmation sent when processed
- Check spam folder

#### **Step 3: Check Billing History**
- Go to Billing → Transaction History
- Look for payment status
- May show "Processing" → Will update when cleared

#### **Step 4: Check Bank/Wallet**
- Verify money was deducted
- Check transaction ID
- Screenshot transaction

#### **After 24 Hours - Contact Support:**
```
Email: support@yoforex.net
Subject: "Payment Pending - [Transaction ID]"

Include:
- Payment method used
- Amount paid
- Transaction ID / Reference number
- Date and time of payment
- Screenshot of bank statement/transaction
```

**Response Time:**
- We'll investigate within 24-48 hours
- Manual verification if needed
- Subscription activated or refund issued

---

### Invoice Not Generated

**Symptoms:**
- Paid but no invoice received
- Can't download invoice
- Invoice missing from Billing section

**Solutions:**

#### **Check Email**
- Invoice sent to registered email
- Check spam/junk folder
- Search for "YoForex" or "Invoice"

#### **Download from Dashboard**
1. Go to Billing → Invoices
2. Find your payment
3. Click "Download Invoice" (PDF)

#### **Invoice Generation Delay**
- Automated invoices may take 5-30 minutes
- Refresh billing page
- Wait and check again

#### **For GST Invoice (India)**
- Ensure GST number added in Settings → Billing
- Re-download invoice after adding GST
- Contact support if still missing

**Request Invoice:**
```
Email: support@yoforex.net
Subject: "Invoice Request - [Transaction ID]"

Include:
- Transaction ID
- Payment date
- Amount paid
- Billing email
- Company details (for business)
```

**We'll send invoice within 24 hours**

---

### Refund Not Received

**Symptoms:**
- Refund approved but money not received
- Refund status shows "Processed" but account not credited

**Refund Timeline:**

**Cashfree (Cards/UPI):**
- Processing: 1-2 business days
- Bank credit: 5-7 business days
- Total: Up to 10 business days

**Cryptocurrency:**
- Refunded as account credits (crypto irreversible)
- Immediate credit to account

**What To Do:**

#### **Step 1: Check Refund Status**
1. Go to Billing → Refunds
2. Look for refund transaction
3. Check status:
   - **Pending**: Being processed
   - **Processed**: Sent to bank
   - **Completed**: Should be in your account

#### **Step 2: Check Bank Account**
- Look for credit from "Cashfree" or "YoForex"
- Check all linked accounts
- Verify correct account on file

#### **Step 3: Contact Bank**
- If status "Processed" but not received after 10 days
- Provide refund reference ID
- Bank can trace payment

#### **Step 4: Contact Support**
After 10 business days:
```
Email: support@yoforex.net
Subject: "Refund Not Received - [Transaction ID]"

Include:
- Original transaction ID
- Refund request date
- Refund reference ID
- Bank account details (last 4 digits)
- Bank statement showing no credit
```

**We'll investigate and resolve**

---

## UI/Display Issues

### Page Not Loading

**Symptoms:**
- Blank page
- "Page not found" error
- Infinite loading
- White screen

**Solutions:**

#### **Step 1: Refresh Page**
```
Hard Refresh:
- Windows: Ctrl+Shift+R
- Mac: Cmd+Shift+R
- Or Ctrl+F5

Clears cached version, loads fresh page
```

#### **Step 2: Clear Cache**
```
Chrome:
Ctrl+Shift+Delete → Clear last 24 hours → Clear data

Firefox:
Ctrl+Shift+Delete → Clear cache → OK

Safari:
Cmd+Option+E → Clear cache
```

#### **Step 3: Check URL**
- Ensure you're on correct URL: https://yoforexai.com
- No typos in URL
- Try clicking logo to return to homepage

#### **Step 4: Disable Extensions**
```
Test in Incognito/Private mode:
- Chrome: Ctrl+Shift+N
- Firefox: Ctrl+Shift+P
- Safari: Cmd+Shift+N

If works in incognito, extension is the issue
```

#### **Step 5: Try Different Browser**
- Chrome → Firefox
- Or Edge, Safari
- Identifies browser-specific issue

#### **Step 6: Check Internet**
- Visit other websites to verify connection
- Restart router if needed
- Try mobile data

**Still Not Loading?**
- Backend may be down
- Check status page or forum
- Contact support

---

### Charts Not Showing

**Symptoms:**
- Blank chart area
- "Loading chart..." forever
- Chart placeholder but no data
- Error in chart area

**Solutions:**

#### **1. JavaScript Disabled**
```
Enable JavaScript:

Chrome:
Settings → Privacy → Site Settings → JavaScript → Allowed

Firefox:
about:config → javascript.enabled → true

Safari:
Preferences → Security → Enable JavaScript ✓
```

#### **2. Ad Blocker Interfering**
- Ad blockers may block chart libraries
- Disable for yoforexai.com
- Or add to whitelist
- Try incognito mode (extensions disabled)

#### **3. Browser Compatibility**
**Update your browser:**
- Minimum Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**If using old browser:**
- Charts may not work
- Update browser
- Or use different browser

#### **4. Network Issue**
- Charts load from CDN (TradingView)
- Network may block CDN
- Try different network
- Disable VPN temporarily

#### **5. Clear Cache**
- Corrupted chart cache
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

---

### Data Not Updating

**Symptoms:**
- Old data displayed
- Prices not refreshing
- Dashboard shows outdated information
- Active trades P&L frozen

**Solutions:**

#### **Manual Refresh**
- Click browser refresh button
- Or press F5
- Hard refresh: Ctrl+Shift+R

#### **Check Last Updated Time**
- Look for timestamp on data
- Some data caches for 30-60 seconds
- Auto-refreshes periodically

#### **Auto-Refresh Settings**
- Some pages auto-refresh every 30 seconds
- Ensure you're not on paused/frozen page
- Close and reopen page

#### **Clear Cache**
- Old cached data may be showing
- Clear browser cache
- Restart browser

#### **WebSocket Connection**
(For real-time data pages)
- Check browser console (F12)
- Look for WebSocket connection error
- May need to re-login
- Check internet connection

**For Developers:**
```javascript
// Check WebSocket status in console
console.log('WebSocket status:', ws.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
```

---

### Mobile View Issues

**Symptoms:**
- Layout broken on phone
- Text overlapping
- Buttons not clickable
- Charts cut off

**Solutions:**

#### **1. Force Desktop Site** (Not Recommended)
Some mobile browsers have "Desktop site" option:
- Better to report issue to us
- Mobile view should work properly

#### **2. Rotate Device**
- Try landscape orientation
- Some features better in landscape
- Especially charts and tables

#### **3. Update Browser**
- Ensure mobile browser is updated
- Chrome, Safari, Firefox latest version

#### **4. Clear Mobile Cache**
```
iPhone Safari:
Settings → Safari → Clear History and Website Data

Android Chrome:
Settings → Privacy → Clear browsing data
```

#### **5. Try Different Mobile Browser**
- Safari → Chrome
- Or Firefox, Edge

#### **6. Report Issue**
```
Email: support@yoforex.net
Subject: "Mobile Display Issue"

Include:
- Device (iPhone 12, Samsung S21, etc.)
- OS version (iOS 16, Android 13)
- Browser (Safari, Chrome)
- Screenshot of issue
- Which page/feature
```

**We prioritize mobile fixes!**

---

## Common Error Messages

### Detailed Error Guide

#### **"Network Error" / "Failed to Fetch"**
**Meaning**: Can't connect to backend  
**Solution**: Check internet, clear cache, try different browser  
**See**: [Network Error](#network-error-message)

---

#### **"Unauthorized" / "401 Unauthorized"**
**Meaning**: Login session expired  
**Solution**: Logout and login again, clear cookies  
**See**: [Unauthorized Error](#unauthorized-error)

---

#### **"Rate Limit Exceeded" / "429 Too Many Requests"**
**Meaning**: Too many requests in short time  
**Solution**: Wait 1 hour, reduce request frequency  
**See**: [Rate Limit](#rate-limit-exceeded)

---

#### **"Insufficient Credits" / "No Credits Available"**
**Meaning**: Monthly token allowance exhausted  
**Solution**: Wait for monthly reset, or upgrade plan  
**See**: Dashboard → Account Summary

---

#### **"Invalid OTP" / "OTP Expired"**
**Meaning**: Wrong code or took too long (10 min expiry)  
**Solution**: Request new OTP, enter quickly  
**See**: [OTP Issues](#otp-not-received)

---

#### **"Payment Failed" / "Transaction Declined"**
**Meaning**: Payment not processed  
**Solution**: Check card details, bank authorization  
**See**: [Payment Failed](#payment-failed)

---

#### **"Analysis Failed" / "No Results"**
**Meaning**: AI couldn't analyze (various reasons)  
**Solution**: Try different pair/timeframe, check credits  
**See**: [Analysis Issues](#analysis-not-working)

---

#### **"Session Expired"**
**Meaning**: Been logged in too long (security)  
**Solution**: Login again  
**Prevention**: Activity extends session

---

#### **"Access Denied" / "403 Forbidden"**
**Meaning**: Don't have permission for that feature  
**Solution**: Upgrade plan, or contact support if error  

---

#### **"Internal Server Error" / "500 Error"**
**Meaning**: Backend error (not your fault)  
**Solution**: Wait 10 minutes and retry, report if persists  
**Contact**: support@yoforex.net

---

#### **"Service Unavailable" / "503 Error"**
**Meaning**: Temporary maintenance or overload  
**Solution**: Wait 15-30 minutes, check status page  

---

#### **"Not Found" / "404 Error"**
**Meaning**: Page/resource doesn't exist  
**Solution**: Check URL, try navigating from homepage  

---

## Browser Issues

### Clear Cache and Cookies

**Why Clear Cache?**
- Fixes most UI issues
- Resolves outdated data
- Fixes broken page layouts
- Solves login problems

#### **Google Chrome**
```
Method 1: Quick Clear
1. Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
2. Time range: "Last 24 hours" (or "All time" for complete clear)
3. Check boxes:
   ✓ Cookies and other site data
   ✓ Cached images and files
4. Click "Clear data"
5. Restart Chrome

Method 2: Site-Specific
1. Click padlock icon in address bar
2. Click "Cookies"
3. Find yoforexai.com
4. Click "Remove" for each cookie
5. Close and reopen site
```

#### **Mozilla Firefox**
```
1. Press Ctrl+Shift+Delete
2. Time range: "Everything"
3. Check boxes:
   ✓ Cookies
   ✓ Cache
4. Click "Clear Now"
5. Restart Firefox
```

#### **Safari (Mac)**
```
1. Safari → Preferences → Privacy
2. Click "Manage Website Data"
3. Search for "yoforex"
4. Click "Remove"
5. Or click "Remove All" for complete clear
6. Confirm
7. Restart Safari
```

#### **Microsoft Edge**
```
1. Press Ctrl+Shift+Delete
2. Time range: "All time"
3. Check boxes:
   ✓ Cookies and other site data
   ✓ Cached images and files
4. Click "Clear now"
5. Restart Edge
```

---

### Try Different Browser

**Why Try Different Browser?**
- Rules out browser-specific bug
- Some browsers have compatibility issues
- Extension conflicts isolated to one browser

**Recommended Browsers:**
1. **Google Chrome** (Recommended)
   - Best compatibility
   - Fastest performance
   - Download: google.com/chrome

2. **Mozilla Firefox**
   - Good privacy
   - Excellent performance
   - Download: mozilla.org/firefox

3. **Microsoft Edge**
   - Built on Chrome engine
   - Good for Windows
   - Pre-installed on Windows 10/11

4. **Safari** (Mac/iOS only)
   - Best for Apple devices
   - Energy efficient

**Not Recommended:**
- Internet Explorer (outdated, not supported)
- Old browser versions (security risk)

**Testing Process:**
1. Install alternative browser
2. Visit yoforexai.com
3. Login
4. Try the feature that wasn't working
5. If works, issue is with original browser
6. If doesn't work, issue is elsewhere

---

### Check Internet Connection

**Test Your Connection:**

#### **Quick Test**
1. Open google.com in new tab
2. If loads → Internet works
3. If doesn't load → Internet issue

#### **Speed Test**
1. Visit speedtest.net
2. Run speed test
3. **Minimum needed**: 5 Mbps download
4. **Recommended**: 10+ Mbps for best experience

**If Slow or Unstable:**

**WiFi Issues:**
- Move closer to router
- Reduce devices on network
- Restart router (unplug 30 seconds, replug)
- Switch to 5GHz band if available

**Ethernet:**
- More stable than WiFi
- Plug cable directly to router
- Best for trading

**Mobile Data:**
- Use as backup if WiFi fails
- Ensure good signal strength
- Watch data usage

**VPN Issues:**
- VPN can slow connection
- Try disabling VPN temporarily
- If must use VPN, choose nearby server

---

### Disable Ad Blockers

**Why Disable?**
- Ad blockers may block legitimate features
- Can interfere with charts (TradingView)
- May block API calls
- Can break page layouts

**How to Disable:**

#### **uBlock Origin**
```
1. Click uBlock icon in toolbar
2. Click big blue power button (should turn gray)
3. Refresh page
```

#### **AdBlock Plus**
```
1. Click AdBlock icon
2. Toggle off "Block ads on this site"
3. Refresh page
```

#### **Browser Built-in Blocker**
```
Chrome:
Settings → Privacy → Site Settings → yoforexai.com → Allow ads

Firefox:
Shield icon in address bar → Turn off protection for this site

Safari:
Preferences → Websites → Content Blockers → yoforexai.com → Allow
```

**Better Solution: Whitelist**
- Instead of fully disabling
- Add yoforexai.com to whitelist
- Blocker stays active for other sites

**Note**: YoForex AI has minimal/no ads, so blocking doesn't provide benefit

---

## Performance Issues

### Slow Loading

**Optimize Performance:**

#### **Browser Optimization**
```
1. Close unused tabs
   - Each tab uses RAM
   - Keep only essentials open

2. Clear browser cache regularly
   - Weekly recommended

3. Disable unused extensions
   - Extensions slow down browser
   - Remove or disable

4. Restart browser daily
   - Clears memory leaks
```

#### **Network Optimization**
```
1. Use Ethernet (not WiFi)
   - More stable, faster

2. Close bandwidth-heavy apps
   - Netflix, YouTube, downloads
   - Frees bandwidth for trading

3. QoS Settings (Router)
   - Prioritize trading traffic
   - Advanced users only
```

#### **Device Optimization**
```
1. Close background applications
2. Restart device weekly
3. Free up disk space (>10% free)
4. Update OS and drivers
5. Check for malware/viruses
```

#### **Platform Settings**
```
1. Use basic AI models for quick checks
   - Mistral, GPT-4o faster than Opus

2. Reduce chart history
   - Less data to load

3. Disable auto-refresh (if available)
   - Manual refresh when needed
```

**If Still Slow:**
- Contact ISP about connection issues
- Consider hardware upgrade
- Use mobile app when available

---

## Mobile App Issues

**Current Status**: Mobile web only (no native app yet)

### Add to Home Screen Not Working

**iPhone:**
1. Use Safari (not Chrome) - only Safari supports this
2. Open yoforexai.com in Safari
3. Tap Share button (square with arrow)
4. Scroll down to "Add to Home Screen"
5. Tap "Add"

**If option missing:**
- Update iOS to latest version
- Clear Safari cache
- Restart iPhone

**Android:**
1. Use Chrome (recommended)
2. Open yoforexai.com
3. Tap menu (three dots)
4. Tap "Add to Home Screen"
5. Confirm

**If option missing:**
- Update Chrome
- Enable "Install web apps" in Chrome flags
- Try Firefox or Samsung Internet

---

## When to Contact Support

**Contact support if:**

✅ **Issue persists after trying all solutions above**  
✅ **Account locked and you don't know why**  
✅ **Payment issues not resolved in 24 hours**  
✅ **Data appears incorrect or corrupted**  
✅ **Security concerns (unusual activity)**  
✅ **You found a bug (help us improve!)**  
✅ **Feature requests or suggestions**

**Don't contact support for:**
❌ Questions already answered in this guide  
❌ How-to questions (see User Guide first)  
❌ Normal system behavior (read docs)  
❌ Broker-specific questions (contact your broker)

**How to Contact:**

**Email**: support@yoforex.net

**Support Ticket**: Login → Support → New Ticket

**Include in Your Message:**
- Clear description of problem
- What you've tried already
- Screenshots of error
- Account email
- Browser and OS version
- Transaction ID (for payment issues)

**Response Times:**
- Free: 48 hours
- Pro: 24 hours
- Max: 4 hours

---

## Quick Troubleshooting Checklist

**Before contacting support, try:**

- [ ] Refresh page (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Try incognito/private mode
- [ ] Try different browser
- [ ] Check internet connection
- [ ] Disable browser extensions
- [ ] Re-login to account
- [ ] Check if credits available
- [ ] Verify market is open (forex hours)
- [ ] Read relevant section of this guide
- [ ] Search community forum

**If all fail → Contact support with details**

---

**Last Updated**: November 1, 2025

**We're here to help! Most issues resolve in minutes. 🛠️💪**
