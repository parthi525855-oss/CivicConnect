/**
 * CivicConnect Automated Comprehensive Verification & Security Test Suite
 * Covers all required endpoints, role-based access control, security edge cases,
 * file upload restrictions, and regex safety.
 */

const { spawn } = require('child_process');
const path = require('path');

const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess = null;
const results = [];

function recordTest(name, expected, actual, pass) {
  results.push({ name, expected, actual, status: pass ? 'PASS' : 'FAIL' });
  const icon = pass ? '✓ PASS' : '✗ FAIL';
  console.log(`[${icon}] ${name}`);
  if (!pass) {
    console.log(`       Expected: ${expected}`);
    console.log(`       Actual:   ${actual}`);
  }
}

async function startServer() {
  return new Promise((resolve, reject) => {
    console.log(`\nStarting test server on port ${PORT}...`);
    serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, '..', 'server'),
      env: {
        ...process.env,
        PORT: String(PORT),
        NODE_ENV: 'test',
        JWT_SECRET: 'test_super_secret_jwt_key_for_testing_verification_2026',
        CLIENT_URL: 'http://localhost:5173'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let started = false;
    serverProcess.stdout.on('data', (data) => {
      const out = data.toString();
      if (out.includes(`running on port ${PORT}`) && !started) {
        started = true;
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      // ignore normal warnings
    });

    serverProcess.on('error', (err) => {
      reject(err);
    });

    setTimeout(() => {
      if (!started) resolve(); // Continue after timeout if banner was missed
    }, 3000);
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
}

async function runAllTests() {
  console.log('======================================================================');
  console.log('       CIVICCONNECT - SECURITY, API & WORKFLOW TEST SUITE             ');
  console.log('======================================================================\n');

  try {
    await startServer();

    // 1. Health Check
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      const body = await res.json();
      const pass = res.status === 200 && body.status === 'online';
      recordTest('Health Endpoint (GET /api/health)', 'HTTP 200, status=online', `HTTP ${res.status}, status=${body.status}`, pass);
    } catch (e) {
      recordTest('Health Endpoint (GET /api/health)', 'HTTP 200', e.message, false);
    }

    // 2. Critical Security Test 1: Public Registration with role="admin"
    const uniqueCitizenSuffix = Date.now();
    const maliciousCitizen = {
      name: 'Sneaky Attacker',
      email: `sneaky_${uniqueCitizenSuffix}@test.com`,
      password: 'password123',
      role: 'admin', // Attempting privilege escalation
      phone: '9999999999',
      address: 'Test City'
    };

    let citizenToken = '';
    let citizenId = '';

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousCitizen)
      });
      const body = await res.json();
      const pass = res.status === 201 && body.user.role === 'citizen';
      citizenToken = body.token;
      citizenId = body.user._id || body.user.id;
      recordTest(
        'Critical Security: Registration role=admin enforcement',
        'HTTP 201, role="citizen" (role strictly forced)',
        `HTTP ${res.status}, role="${body.user?.role}"`,
        pass
      );
    } catch (e) {
      recordTest('Critical Security: Registration role=admin enforcement', 'HTTP 201, role=citizen', e.message, false);
    }

    // 3. Validation: Register with short password (< 6 chars)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Short', email: 'short@test.com', password: '123' })
      });
      recordTest('Registration Validation: Short Password (< 6 chars)', 'HTTP 400', `HTTP ${res.status}`, res.status === 400);
    } catch (e) {
      recordTest('Registration Validation: Short Password', 'HTTP 400', e.message, false);
    }

    // 4. Validation: Register duplicate email
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maliciousCitizen)
      });
      recordTest('Registration Validation: Duplicate Email Rejected', 'HTTP 400', `HTTP ${res.status}`, res.status === 400);
    } catch (e) {
      recordTest('Registration Validation: Duplicate Email', 'HTTP 400', e.message, false);
    }

    // 5. Normal Citizen Login
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: maliciousCitizen.email, password: 'password123' })
      });
      const body = await res.json();
      const pass = res.status === 200 && Boolean(body.token);
      recordTest('Citizen Login (POST /api/auth/login)', 'HTTP 200 with JWT token', `HTTP ${res.status}, token=${Boolean(body.token)}`, pass);
    } catch (e) {
      recordTest('Citizen Login', 'HTTP 200', e.message, false);
    }

    // 6. Login Validation: Invalid Credentials
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: maliciousCitizen.email, password: 'wrongpassword' })
      });
      recordTest('Login Security: Wrong Password Rejected', 'HTTP 401', `HTTP ${res.status}`, res.status === 401);
    } catch (e) {
      recordTest('Login Wrong Password', 'HTTP 401', e.message, false);
    }

    // 7. Admin Login
    let adminToken = '';
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@civicconnect.gov', password: 'admin123' })
      });
      const body = await res.json();
      adminToken = body.token;
      const pass = res.status === 200 && body.user.role === 'admin';
      recordTest('Admin Login (admin@civicconnect.gov)', 'HTTP 200, role="admin"', `HTTP ${res.status}, role="${body.user?.role}"`, pass);
    } catch (e) {
      recordTest('Admin Login', 'HTTP 200', e.message, false);
    }

    // 8. Critical Security Test 2: Citizen calls Admin Dashboard endpoint
    try {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      recordTest('Security Authorization: Citizen blocked from Admin Dashboard', 'HTTP 403 Forbidden', `HTTP ${res.status}`, res.status === 403);
    } catch (e) {
      recordTest('Citizen blocked from Admin Dashboard', 'HTTP 403', e.message, false);
    }

    // 9. Critical Security Test 3: Unauthenticated request to protected endpoint
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`);
      recordTest('Security Authorization: Unauthenticated request to /auth/me', 'HTTP 401 Unauthorized', `HTTP ${res.status}`, res.status === 401);
    } catch (e) {
      recordTest('Unauthenticated request', 'HTTP 401', e.message, false);
    }

    // 10. Critical Security Test 5: Invalid JWT token
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: 'Bearer this_is_a_completely_fake_invalid_token' }
      });
      recordTest('Security Token: Invalid JWT signature rejected', 'HTTP 401 Unauthorized', `HTTP ${res.status}`, res.status === 401);
    } catch (e) {
      recordTest('Invalid JWT token', 'HTTP 401', e.message, false);
    }

    // 11. Admin Access to Dashboard
    try {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && body.success === true;
      recordTest('Admin Dashboard Access (GET /api/admin/dashboard)', 'HTTP 200, success=true', `HTTP ${res.status}`, pass);
    } catch (e) {
      recordTest('Admin Dashboard Access', 'HTTP 200', e.message, false);
    }

    // 12. Create Civic Issue (Citizen)
    let createdIssue = null;
    try {
      const res = await fetch(`${BASE_URL}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${citizenToken}`
        },
        body: JSON.stringify({
          title: 'Dangerous deep pothole near junction',
          description: 'A deep pothole is causing sudden accidents and vehicle damage. Urgent fix needed.',
          category: 'Roads',
          location: 'Anna Salai Junction, Ward 112',
          landmark: 'Opposite Central Library'
        })
      });
      const body = await res.json();
      createdIssue = body.data;
      const pass = res.status === 201 && createdIssue && createdIssue.complaintId.startsWith('CIV-');
      recordTest(
        'Create Issue & Sequential ID (POST /api/issues)',
        'HTTP 201, complaintId format CIV-YYYY-XXXX',
        `HTTP ${res.status}, ID=${createdIssue?.complaintId}`,
        pass
      );
    } catch (e) {
      recordTest('Create Issue', 'HTTP 201', e.message, false);
    }

    // 13. Smart Rule-Based Priority Engine Evaluation
    if (createdIssue) {
      // Category is 'Roads' (high category) and text contains 'accident' (critical keyword) -> HIGH priority!
      const pass = createdIssue.priority === 'HIGH';
      recordTest(
        'Rule-based Priority Engine: High Category + Danger Keyword',
        'priority="HIGH" (Roads + accident keyword)',
        `priority="${createdIssue.priority}" (${createdIssue.priorityReason})`,
        pass
      );
    }

    // 14. Pagination Support & Backwards Compatibility
    try {
      const res = await fetch(`${BASE_URL}/api/issues?page=1&limit=2`);
      const body = await res.json();
      const pass = res.status === 200 && Array.isArray(body.data) && body.page === 1 && body.totalPages >= 1;
      recordTest('Issue Pagination (?page=1&limit=2)', 'HTTP 200 with totalPages, page, count', `HTTP ${res.status}, totalPages=${body.totalPages}`, pass);
    } catch (e) {
      recordTest('Issue Pagination', 'HTTP 200', e.message, false);
    }

    // 15. Search Regex Safety (Query with special characters)
    try {
      const res = await fetch(`${BASE_URL}/api/issues?search=(accident+road*`);
      const body = await res.json();
      const pass = res.status === 200 && Array.isArray(body.data);
      recordTest('Search Regex Safety (Special regex chars in search)', 'HTTP 200 (No SyntaxError crash)', `HTTP ${res.status}`, pass);
    } catch (e) {
      recordTest('Search Regex Safety', 'HTTP 200', e.message, false);
    }

    // 16. Upvote Mechanism: Add Support
    let issueId = createdIssue ? (createdIssue._id || createdIssue.id) : '';
    try {
      const res = await fetch(`${BASE_URL}/api/issues/${issueId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && body.supported === true && body.upvotes === 1;
      recordTest('Citizen Upvote: Endorse Issue', 'HTTP 200, supported=true, upvotes=1', `HTTP ${res.status}, supported=${body.supported}, upvotes=${body.upvotes}`, pass);
    } catch (e) {
      recordTest('Citizen Upvote', 'HTTP 200', e.message, false);
    }

    // 17. Upvote Mechanism: Toggle Off (Remove Support)
    try {
      const res = await fetch(`${BASE_URL}/api/issues/${issueId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && body.supported === false && body.upvotes === 0;
      recordTest('Citizen Upvote: Toggle Off Support', 'HTTP 200, supported=false, upvotes=0', `HTTP ${res.status}, supported=${body.supported}, upvotes=${body.upvotes}`, pass);
    } catch (e) {
      recordTest('Citizen Upvote Toggle Off', 'HTTP 200', e.message, false);
    }

    // 18. Critical Security Test 4: Another Citizen attempts to modify Citizen 1's issue
    const otherCitizen = {
      name: 'Unrelated Citizen',
      email: `other_${Date.now()}@test.com`,
      password: 'password123'
    };
    let otherToken = '';
    const otherReg = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(otherCitizen)
    });
    const otherBody = await otherReg.json();
    otherToken = otherBody.token;

    try {
      const res = await fetch(`${BASE_URL}/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${otherToken}`
        },
        body: JSON.stringify({ title: 'Unauthorized Modification' })
      });
      recordTest('Security Authorization: Other citizen cannot modify issue', 'HTTP 403 Forbidden', `HTTP ${res.status}`, res.status === 403);
    } catch (e) {
      recordTest('Other citizen modify issue', 'HTTP 403', e.message, false);
    }

    // 19. Admin Status Workflow Progression
    try {
      const res = await fetch(`${BASE_URL}/api/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 'Under Review',
          adminRemark: 'Inspected by Zonal Assistant Engineer.'
        })
      });
      const body = await res.json();
      const pass = res.status === 200 && body.data.status === 'Under Review';
      recordTest('Admin Status Workflow (Reported -> Under Review)', 'HTTP 200, status="Under Review"', `HTTP ${res.status}, status="${body.data?.status}"`, pass);
    } catch (e) {
      recordTest('Admin Status Workflow', 'HTTP 200', e.message, false);
    }

    // 20. Admin Status Guard: Redundant status rejected
    try {
      const res = await fetch(`${BASE_URL}/api/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: 'Under Review' })
      });
      recordTest('Status Workflow Guard: Redundant status update rejected', 'HTTP 400 Bad Request', `HTTP ${res.status}`, res.status === 400);
    } catch (e) {
      recordTest('Redundant status update', 'HTTP 400', e.message, false);
    }

    // 21. Notification Delivery (Check author notification after status update)
    try {
      const res = await fetch(`${BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${citizenToken}` }
      });
      const body = await res.json();
      const pass = res.status === 200 && Array.isArray(body.data) && body.data.length > 0;
      recordTest('Notification Polling (GET /api/notifications)', 'HTTP 200 with notification records', `HTTP ${res.status}, count=${body.data?.length}`, pass);
    } catch (e) {
      recordTest('Notification Polling', 'HTTP 200', e.message, false);
    }

    // 22. Critical Security Test 7: Upload Invalid Image File (.txt / text file)
    try {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
      const invalidFileContent = '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="title"\r\n\r\nTest Invalid File\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="description"\r\n\r\nSome description\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="category"\r\n\r\nRoads\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="location"\r\n\r\nLocation\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="image"; filename="malicious.txt"\r\n' +
        'Content-Type: text/plain\r\n\r\n' +
        'Malicious script content\r\n' +
        '--' + boundary + '--\r\n';

      const res = await fetch(`${BASE_URL}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          Authorization: `Bearer ${citizenToken}`
        },
        body: invalidFileContent
      });
      recordTest('Security Upload: Non-image file rejected (text/plain)', 'HTTP 400 Bad Request', `HTTP ${res.status}`, res.status === 400);
    } catch (e) {
      recordTest('Upload non-image file', 'HTTP 400', e.message, false);
    }

    // 23. Critical Security Test 8: Upload File > 5 MB
    try {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
      const largePayload = Buffer.alloc(6 * 1024 * 1024, 'a'); // 6 MB buffer
      const headerPart = Buffer.from(
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="title"\r\n\r\nLarge File Report\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="description"\r\n\r\nTesting oversize limit\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="category"\r\n\r\nRoads\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="location"\r\n\r\nMain Street\r\n' +
        '--' + boundary + '\r\n' +
        'Content-Disposition: form-data; name="image"; filename="giant_photo.jpg"\r\n' +
        'Content-Type: image/jpeg\r\n\r\n'
      );
      const footerPart = Buffer.from('\r\n--' + boundary + '--\r\n');
      const fullBody = Buffer.concat([headerPart, largePayload, footerPart]);

      const res = await fetch(`${BASE_URL}/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          Authorization: `Bearer ${citizenToken}`
        },
        body: fullBody
      });
      recordTest('Security Upload: Oversized file (> 5 MB) rejected', 'HTTP 400 Bad Request', `HTTP ${res.status}`, res.status === 400);
    } catch (e) {
      recordTest('Upload oversized file', 'HTTP 400', e.message, false);
    }

  } finally {
    stopServer();
  }

  // Summary Table
  console.log('\n======================================================================');
  console.log('                          TEST SUITE RESULTS                          ');
  console.log('======================================================================');
  const passedCount = results.filter((r) => r.status === 'PASS').length;
  const totalCount = results.length;

  console.table(results);
  console.log(`\nTOTAL: ${passedCount} / ${totalCount} PASSED`);

  if (passedCount === totalCount) {
    console.log('✓ ALL SECURITY & INTEGRATION TESTS PASSED CLEANLY!\n');
    process.exit(0);
  } else {
    console.error('✗ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

runAllTests().catch((e) => {
  console.error('Fatal test execution error:', e);
  stopServer();
  process.exit(1);
});
