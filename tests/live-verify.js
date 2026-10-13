/**
 * Live API Verification against http://localhost:5000
 */

const BASE_URL = 'http://localhost:5000';

const results = [];
function record(name, expected, actual, pass) {
  results.push({ name, expected, actual, status: pass ? 'PASS' : 'FAIL' });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}: ${actual}`);
}

async function run() {
  console.log('\n--- STARTING LIVE API VERIFICATION (http://localhost:5000) ---\n');

  // 1. Registration
  const testEmail = `citizen_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Verify Citizen',
      email: testEmail,
      password: 'password123',
      role: 'admin' // Attempt admin registration
    })
  });
  const regData = await regRes.json();
  const citizenToken = regData.token;
  const citizenId = regData.user?.id || regData.user?._id;
  record(
    'Admin Registration Prevention',
    'HTTP 201, role="citizen"',
    `HTTP ${regRes.status}, role="${regData.user?.role}"`,
    regRes.status === 201 && regData.user?.role === 'citizen'
  );

  // 2. Duplicate Registration
  const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duplicate',
      email: testEmail,
      password: 'password123'
    })
  });
  record('Duplicate Registration', 'HTTP 400', `HTTP ${dupRes.status}`, dupRes.status === 400);

  // 3. Login Valid
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'password123' })
  });
  const loginData = await loginRes.json();
  record('Valid Login', 'HTTP 200 with token', `HTTP ${loginRes.status}, token=${Boolean(loginData.token)}`, loginRes.status === 200 && Boolean(loginData.token));

  // 4. Invalid Login
  const badLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'wrong' })
  });
  record('Invalid Login', 'HTTP 401', `HTTP ${badLogin.status}`, badLogin.status === 401);

  // 5. Protected Endpoint Without Token
  const noToken = await fetch(`${BASE_URL}/api/auth/me`);
  record('Protected Endpoint Without Token', 'HTTP 401', `HTTP ${noToken.status}`, noToken.status === 401);

  // 6. Protected Endpoint With Valid Token
  const withToken = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  record('Protected Endpoint With Token', 'HTTP 200', `HTTP ${withToken.status}`, withToken.status === 200);

  // 7. Invalid JWT
  const badToken = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: 'Bearer totally_invalid_jwt_signature' }
  });
  record('Invalid JWT Token', 'HTTP 401', `HTTP ${badToken.status}`, badToken.status === 401);

  // 8. Admin Security: Citizen Accessing Admin Endpoint
  const citizenToAdmin = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  record('Citizen Blocked from Admin Dashboard', 'HTTP 403', `HTTP ${citizenToAdmin.status}`, citizenToAdmin.status === 403);

  // Admin Login for subsequent tests
  const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@civicconnect.gov', password: 'admin123' })
  });
  const adminData = await adminLogin.json();
  const adminToken = adminData.token;

  // 9. Create Issue
  const createRes = await fetch(`${BASE_URL}/api/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`
    },
    body: JSON.stringify({
      title: 'Water pipe leak on Market Street',
      description: 'Major water leakage creating muddy road and wasting drinking water.',
      category: 'Water',
      location: 'Market Street, Ward 4',
      landmark: 'Near Vegetable Market'
    })
  });
  const createData = await createRes.json();
  const issue = createData.data;
  const issueId = issue?._id || issue?.id;
  record('Create Issue', 'HTTP 201 with complaintId', `HTTP ${createRes.status}, id=${issue?.complaintId}`, createRes.status === 201 && Boolean(issue?.complaintId));

  // 10. List Issues
  const listRes = await fetch(`${BASE_URL}/api/issues`);
  const listData = await listRes.json();
  record('List Issues', 'HTTP 200', `HTTP ${listRes.status}, count=${listData.count}`, listRes.status === 200 && Array.isArray(listData.data));

  // 11. Get Single Issue
  const getSingle = await fetch(`${BASE_URL}/api/issues/${issueId}`);
  record('Get Single Issue', 'HTTP 200', `HTTP ${getSingle.status}`, getSingle.status === 200);

  // 12. Update Issue (Owner)
  const updateRes = await fetch(`${BASE_URL}/api/issues/${issueId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`
    },
    body: JSON.stringify({
      title: 'Severe water pipe burst on Market Street'
    })
  });
  const updateData = await updateRes.json();
  record('Update Issue by Owner', 'HTTP 200', `HTTP ${updateRes.status}, title="${updateData.data?.title}"`, updateRes.status === 200);

  // 13. Update Issue Authorization (Non-owner citizen)
  const nonOwnerToken = (await (await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Other User', email: `other_${Date.now()}@example.com`, password: 'password123' })
  })).json()).token;

  const badUpdate = await fetch(`${BASE_URL}/api/issues/${issueId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${nonOwnerToken}`
    },
    body: JSON.stringify({ title: 'Hacked Title' })
  });
  record('Unauthorized Issue Edit Blocked', 'HTTP 403', `HTTP ${badUpdate.status}`, badUpdate.status === 403);

  // 14. Invalid Input on Issue Creation
  const badCreate = await fetch(`${BASE_URL}/api/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`
    },
    body: JSON.stringify({ title: '' })
  });
  record('Invalid Input Issue Rejection', 'HTTP 400', `HTTP ${badCreate.status}`, badCreate.status === 400);

  // 15. Upvotes: Add Upvote
  const upvote1 = await fetch(`${BASE_URL}/api/issues/${issueId}/upvote`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  const up1Data = await upvote1.json();
  record('Add Upvote', 'HTTP 200, upvotes=1', `HTTP ${upvote1.status}, upvotes=${up1Data.upvotes}`, upvote1.status === 200 && up1Data.upvotes === 1);

  // 16. Upvotes: Toggle Off (Remove Upvote)
  const upvote2 = await fetch(`${BASE_URL}/api/issues/${issueId}/upvote`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  const up2Data = await upvote2.json();
  record('Remove Upvote (Toggle Off)', 'HTTP 200, upvotes=0', `HTTP ${upvote2.status}, upvotes=${up2Data.upvotes}`, upvote2.status === 200 && up2Data.upvotes === 0);

  // 17. Notifications: Creation & List
  // Trigger status update from admin to generate notification
  await fetch(`${BASE_URL}/api/issues/${issueId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Under Review', adminRemark: 'Investigating pipe size.' })
  });

  const notifsRes = await fetch(`${BASE_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  const notifsData = await notifsRes.json();
  const notifList = notifsData.data || [];
  const notifId = notifList[0]?._id || notifList[0]?.id;
  record('Notification Creation & List', 'HTTP 200 with records', `HTTP ${notifsRes.status}, count=${notifList.length}`, notifsRes.status === 200 && notifList.length > 0);

  // 18. Notifications: Mark Read
  if (notifId) {
    const markReadRes = await fetch(`${BASE_URL}/api/notifications/${notifId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    record('Mark Notification Read', 'HTTP 200', `HTTP ${markReadRes.status}`, markReadRes.status === 200);
  }

  // 19. Notifications: Mark All Read
  const markAllRes = await fetch(`${BASE_URL}/api/notifications/read-all`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  record('Mark All Notifications Read', 'HTTP 200', `HTTP ${markAllRes.status}`, markAllRes.status === 200);

  // 20. Image Upload: Valid Image (1x1 PNG)
  const boundary = '----Boundary' + Math.random().toString(36).substring(2);
  const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const validImageBody = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nValid Photo Report\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nPhoto attached\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nRoads\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="location"\r\n\r\nNorth Street\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="dot.png"\r\nContent-Type: image/png\r\n\r\n`
    ),
    tinyPng,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const validImgRes = await fetch(`${BASE_URL}/api/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      Authorization: `Bearer ${citizenToken}`
    },
    body: validImageBody
  });
  record('Valid Image Upload', 'HTTP 201', `HTTP ${validImgRes.status}`, validImgRes.status === 201);

  // 21. Image Upload: Invalid File (text file)
  const invalidFileBody = `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nBad File\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nDesc\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nRoads\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="location"\r\n\r\nLocation\r\n` +
    `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="script.sh"\r\nContent-Type: application/x-sh\r\n\r\necho hi\r\n` +
    `--${boundary}--\r\n`;

  const invalidImgRes = await fetch(`${BASE_URL}/api/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      Authorization: `Bearer ${citizenToken}`
    },
    body: invalidFileBody
  });
  record('Invalid File Upload Rejection', 'HTTP 400', `HTTP ${invalidImgRes.status}`, invalidImgRes.status === 400);

  // 22. Image Upload: File > 5 MB
  const big6MB = Buffer.alloc(6 * 1024 * 1024, 'a');
  const bigBody = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nGiant File\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nDesc\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nRoads\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="location"\r\n\r\nLocation\r\n` +
      `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="giant.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`
    ),
    big6MB,
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const bigRes = await fetch(`${BASE_URL}/api/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      Authorization: `Bearer ${citizenToken}`
    },
    body: bigBody
  });
  record('Oversized File (> 5 MB) Rejection', 'HTTP 400', `HTTP ${bigRes.status}`, bigRes.status === 400);

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.table(results);
  const allPass = results.every(r => r.status === 'PASS');
  console.log(`\nOVERALL: ${results.filter(r => r.status === 'PASS').length} / ${results.length} PASSED`);
  process.exit(allPass ? 0 : 1);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
