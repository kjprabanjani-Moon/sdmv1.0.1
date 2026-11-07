
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Sdm@123";
const USER_USERNAME = "user";
const USER_PASSWORD = "user123";

/*======================================================
/* LOGIN PAGE
/*======================================================= */


const APP_PAGE_META = {
  Login: {
    title: 'Smart Nutrition Login',
    description: 'Sign in to your DietTwin smart nutrition and wellness dashboard.'
  },
  AdminDashboard: {
    title: 'Admin Dashboard | DietTwin',
    description: 'Manage nutrition profiles, reports, and DietTwin members.'
  },
  UserDashboard: {
    title: 'Nutrition Dashboard | DietTwin',
    description: 'View your nutrition profile, diet plan, weight progress, and reports.'
  },
  PersonalDetails: {
    title: 'Personal Details | DietTwin',
    description: 'Manage your personal health and nutrition profile securely.'
  },
  DietTwin: {
    title: 'Digital Nutrition Twin | DietTwin',
    description: 'Explore your personalized digital nutrition twin and wellness insights.'
  },
  DietPlan: {
    title: 'Personal Diet Plan | DietTwin',
    description: 'View a personalized nutrition and meal plan.'
  },
  WeightTracking: {
    title: 'Weight Tracking | DietTwin',
    description: 'Track weight changes and progress toward your health goal.'
  },
  Reports: {
    title: 'Nutrition Reports | DietTwin',
    description: 'Review health, nutrition, and weight progress reports.'
  },
  HelpSupport: {
    title: 'Help and Support | DietTwin',
    description: 'Get help with DietTwin and submit support requests.'
  }
};

const APP_RESPONSIVE_STYLES = `
<style>
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; min-height: 100vh; overflow-x: hidden; }
*, *::before, *::after { box-sizing: border-box; }
img, video, canvas, svg { max-width: 100%; height: auto; }
button, input, select, textarea { font: inherit; }
button, a, input, select, textarea { touch-action: manipulation; }
:focus-visible { outline: 3px solid #14b8a6; outline-offset: 3px; }
.container, .main-content, .content, .dashboard-content {
  width: min(100% - 32px, 1200px); margin-inline: auto;
}
table { width: 100%; }
@media (max-width: 900px) {
  .container, .main-content, .content, .dashboard-content { width: min(100% - 24px, 1200px); }
  .sidebar { position: static; width: 100%; height: auto !important; }
  .dashboard, .dashboard-container, .app-container, .main-layout { flex-direction: column !important; }
}
@media (max-width: 640px) {
  .container, .main-content, .content, .dashboard-content { width: calc(100% - 20px); }
  button, .btn, .button { min-height: 44px; }
  input, select, textarea { min-height: 44px; }
  .grid, .cards, .form-grid, .stats-grid, .dashboard-grid { grid-template-columns: 1fr !important; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
  h1 { font-size: clamp(1.75rem, 9vw, 2.25rem); }
  h2 { font-size: clamp(1.35rem, 7vw, 1.75rem); }
}
</style>`;

function enhanceAppPage_(fileName) {
  const pageName = APP_PAGE_META[fileName] ? fileName : 'Login';
  const appFileNames = {
    Login: 'login',
    AdminDashboard: 'adminDashboard',
    PersonalDetails: 'PersonalDetails',
    DietTwin: 'DietTwin',
    DietPlan: 'DietPlan',
    WeightTracking: 'WeightTracking',
    Reports: 'Reports',
    HelpSupport: 'HelpSupport'
  };
  const output = HtmlService.createHtmlOutputFromFile(appFileNames[pageName] || pageName);
  let html = output.getContent();
  const meta = APP_PAGE_META[pageName];
  const viewport = '<meta name="viewport" content="width=device-width, initial-scale=1">';
  const description = '<meta name="description" content="' +
    meta.description.replace(/"/g, '&quot;') + '">';
  const themeColor = '<meta name="theme-color" content="#0f766e">';
  const robots = '<meta name="robots" content="noindex, nofollow">';
  const openGraph = '<meta property="og:title" content="' + meta.title.replace(/"/g, '&quot;') +
    '">' + '\n<meta property="og:description" content="' +
    meta.description.replace(/"/g, '&quot;') + '">' +
    '\n<meta property="og:type" content="website">';
  const responsive = viewport + '\n' + description + '\n' + themeColor + '\n' +
    robots + '\n' + openGraph;

  html = html.replace(/<meta\s+[^>]*name=["']viewport["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+[^>]*name=["']description["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+[^>]*name=["']theme-color["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+[^>]*name=["']robots["'][^>]*>\s*/gi, '');
  html = html.replace(/<meta\s+[^>]*property=["']og:(?:title|description|type)["'][^>]*>\s*/gi, '');

  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, '<head$1>\n' + responsive);
  } else {
    html = responsive + '\n' + html;
  }
  html = html.replace(/<html(?![^>]*\blang=)/i, '<html lang="en"');

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, APP_RESPONSIVE_STYLES + '\n</head>');
  } else {
    html += APP_RESPONSIVE_STYLES;
  }

  return HtmlService.createHtmlOutput(html)
    .setTitle(meta.title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function doGet(e) {
  const page = String(
    e && e.parameter && e.parameter.page
      ? e.parameter.page
      : 'Login'
  ).trim();

  const allowedPages = {
    Login: 'Login',
    AdminDashboard: 'AdminDashboard',
    UserDashboard: 'PersonalDetails',
    PersonalDetails: 'PersonalDetails',
    DietTwin: 'DietTwin',
    DietPlan: "DietPlan",
    WeightTracking: 'WeightTracking',
    Reports: 'Reports',
    HelpSupport: 'HelpSupport'
  };

  const fileName = allowedPages[page] || 'Login';

  return enhanceAppPage_(fileName);
}

function login(username, password) {
  username = String(username || "").trim();
  password = String(password || "");

  const properties = PropertiesService.getScriptProperties();
  const adminUsername = String(properties.getProperty('ADMIN_USERNAME') || ADMIN_USERNAME).trim();
  const adminPassword = String(properties.getProperty('ADMIN_PASSWORD') || ADMIN_PASSWORD);
  const userUsername = String(properties.getProperty('USER_USERNAME') || USER_USERNAME).trim();
  const userPassword = String(properties.getProperty('USER_PASSWORD') || USER_PASSWORD);

  if (username === adminUsername && password === adminPassword) {
    return {
      ok: true,
      username: ADMIN_USERNAME,
      role: "admin",
      redirect: "AdminDashboard",
      url: ScriptApp.getService().getUrl(),
      message: "Admin login successful."
    };
  }

  if (username === userUsername && password === userPassword) {
    return {
      ok: true,
      username: USER_USERNAME,
      role: "user",
      redirect: "PersonalDetails",
      url: ScriptApp.getService().getUrl(),
      message: "User login successful."
    };
  }

  return {
    ok: false,
    username: "",
    role: "",
    redirect: "Login",
    url: ScriptApp.getService().getUrl(),
    message: "Invalid username or password."
  };
}

function getHtml(pageName) {
  var allowedModules = [
    "PersonalDetails",
    "DietTwin",
    "DietPlan",
    "WeightTracking",
    "Reports",
    "HelpSupport"
  ];

  if (allowedModules.indexOf(pageName) === -1) {
    throw new Error("Invalid module requested.");
  }

  return HtmlService.createHtmlOutputFromFile(pageName).getContent();
}



/*============================================================= */
/* START PersonalDetails FUNCTIONs
/*============================================================= */

const PERSONAL_DETAILS_SHEET_NAME = 'PersonalDetails';
const PERSONAL_DETAILS_HEADERS = [
  'UserID', 'FullName', 'mobile', 'NationalID', 'Email', 'Age', 'Gender',
  'Height_cm', 'CurrentWeight_kg', 'Diet Prefernce', 'Country',
  'Health conditions', 'TargetWeight_kg', 'FoodAllergies',
  'MedicalConditions', 'SleepHours', 'WaterIntake_L', 'ExerciseMinutes'
];

const PERSONAL_DETAILS_OPTIONAL = [
  'heightcm', 'currentweightkg', 'dietprefernce', 'country',
  'healthconditions', 'targetweightkg', 'foodallergies',
  'medicalconditions', 'sleephours', 'waterintakel', 'exerciseminutes'
];

function cleanPersonalDetail_(value) {
  return String(value == null ? '' : value).trim().slice(0, 2000);
}

function safePersonalDetailValue_(value) {
  if (typeof value === 'number' || value instanceof Date) return value;
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function personalDetailsHeaderKey_(header) {
  return String(header == null ? '' : header)
    .trim().toLowerCase().replace(/[_\s-]+/g, '').replace(/[^a-z0-9]/g, '');
}

function getPersonalDetailsSheet_() {
  const ss = typeof getSpreadsheet_ === 'function'
    ? getSpreadsheet_()
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet available. Bind this script to the target Google Sheet.');

  let sheet = ss.getSheetByName(PERSONAL_DETAILS_SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(PERSONAL_DETAILS_SHEET_NAME);

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (!lastRow || !lastCol) {
    sheet.getRange(1, 1, 1, PERSONAL_DETAILS_HEADERS.length).setValues([PERSONAL_DETAILS_HEADERS]);
  } else {
    const existing = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0]
      .map(h => String(h || '').trim());
    if (existing.every(h => !h)) {
      sheet.getRange(1, 1, 1, PERSONAL_DETAILS_HEADERS.length).setValues([PERSONAL_DETAILS_HEADERS]);
    } else {
      const keys = existing.map(personalDetailsHeaderKey_);
      const missing = PERSONAL_DETAILS_HEADERS.filter(h => !keys.includes(personalDetailsHeaderKey_(h)));
      if (missing.length) sheet.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
    }
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, sheet.getLastColumn())
    .setFontWeight('bold').setBackground('#dff4e9');
  return sheet;
}

function personalDetailsHeaderMap_(headers) {
  const map = {};
  headers.forEach((h, i) => {
    const key = personalDetailsHeaderKey_(h);
    if (key && map[key] === undefined) map[key] = i;
  });
  return map;
}

function personalDetailsInputMap_(data) {
  const input = {};
  Object.keys(data || {}).forEach(key => input[personalDetailsHeaderKey_(key)] = data[key]);
  const aliases = {
    mobile: ['mobileno', 'mobilephone', 'phone', 'phonenumber'],
    nationalid: ['nationalidnumber', 'nationalidentity'],
    email: ['emailaddress'],
    gender: ['sex'],
    heightcm: ['height'],
    currentweightkg: ['currentweight', 'weightkg', 'weight'],
    dietprefernce: ['dietpreference', 'diet'],
    healthconditions: ['healthcondition'],
    waterintakel: ['waterintake', 'waterintakeperday', 'waterlitres'],
    exerciseminutes: ['exercise', 'exerciseperday', 'exerciseminutesperday']
  };
  Object.keys(aliases).forEach(canonical => {
    if (input[canonical] !== undefined) return;
    for (const alias of aliases[canonical]) {
      const aliasKey = personalDetailsHeaderKey_(alias);
      if (input[aliasKey] !== undefined) { input[canonical] = input[aliasKey]; break; }
    }
  });
  return input;
}

function validatePersonalDetails_(input, headers, existingRow) {
  const map = personalDetailsHeaderMap_(headers);
  const values = {};
  const required = ['fullname', 'mobile', 'nationalid', 'email', 'age', 'gender'];

  headers.forEach(header => {
    const key = personalDetailsHeaderKey_(header);
    if (!key || key === 'userid') return;
    let raw = input[key];
    if (raw === undefined && existingRow && map[key] !== undefined) raw = existingRow[map[key]];
    values[key] = cleanPersonalDetail_(raw);
    if (required.includes(key) && !values[key]) throw new Error(header + ' is required.');
  });

  if (!/^\d{7,15}$/.test(values.mobile || '')) throw new Error('Mobile must contain 7 to 15 digits only.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email || '')) throw new Error('Enter a valid email address.');

  const age = Number(values.age);
  if (!values.age || !Number.isInteger(age) || age < 18 || age > 100) {
    throw new Error('Age must be a whole number between 18 and 100.');
  }
  values.age = age;

  const gender = String(values.gender || '').toLowerCase();
  if (gender !== 'female' && gender !== 'male') throw new Error('Gender must be Female or Male.');
  values.gender = gender === 'female' ? 'Female' : 'Male';

  const numericRules = {
    heightcm: ['Height (cm)', 1, 300],
    currentweightkg: ['Current weight (kg)', 1, 500],
    targetweightkg: ['Target weight (kg)', 1, 500],
    sleephours: ['Sleep hours', 0, 24],
    waterintakel: ['Water intake (L)', 0, 100],
    exerciseminutes: ['Exercise minutes', 0, 1440]
  };
  Object.keys(numericRules).forEach(key => {
    if (values[key] == null || values[key] === '') return;
    const n = Number(values[key]);
    const rule = numericRules[key];
    if (!Number.isFinite(n) || n < rule[1] || n > rule[2]) {
      throw new Error(rule[0] + ' must be between ' + rule[1] + ' and ' + rule[2] + '.');
    }
    values[key] = n;
  });
  return values;
}

/** Create a new profile. */
function savePersonalDetails(formData) {
  if (!formData || typeof formData !== 'object') throw new Error('Please enter your personal details.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getPersonalDetailsSheet_();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
      .map(h => String(h || '').trim());
    const input = personalDetailsInputMap_(formData);
    const values = validatePersonalDetails_(input, headers, null);
    const userId = 'UID-' + Utilities.getUuid().replace(/-/g, '').slice(0, 12).toUpperCase();
    const row = headers.map(header => {
      const key = personalDetailsHeaderKey_(header);
      if (key === 'userid') return userId;
      return safePersonalDetailValue_(values[key] == null ? '' : values[key]);
    });
    sheet.appendRow(row);
    SpreadsheetApp.flush();
    return { ok: true, userId: userId, message: 'Personal details saved successfully.' };
  } finally {
    lock.releaseLock();
  }
}

/** Search/list records for the grid. Searches name, mobile, NationalID, email and UserID. */


/** Get one profile by stable UserID when a grid row is selected. */


/** Update an existing record by UserID, not row number. */
function updatePersonalDetailsRecord(userId, updatedValues) {
  const wanted = cleanPersonalDetail_(userId);
  if (!wanted) throw new Error('UserID is required to update a profile.');
  if (!updatedValues || typeof updatedValues !== 'object') throw new Error('No updated values were provided.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getPersonalDetailsSheet_();
    const range = sheet.getDataRange();
    const data = range.getValues();
    if (data.length < 2) throw new Error('No personal details found.');
    const headers = data[0].map(h => String(h || '').trim());
    const map = personalDetailsHeaderMap_(headers);
    if (map.userid === undefined) throw new Error('UserID column is missing.');

    let target = -1;
    for (let r = 1; r < data.length; r++) {
      if (String(data[r][map.userid] || '').trim() === wanted) { target = r; break; }
    }
    if (target < 0) throw new Error('Profile not found. Refresh the grid and try again.');

    const input = personalDetailsInputMap_(updatedValues);
    const values = validatePersonalDetails_(input, headers, data[target]);
    const row = data[target].slice();
    headers.forEach((header, c) => {
      const key = personalDetailsHeaderKey_(header);
      if (!key || key === 'userid' || input[key] === undefined) return;
      row[c] = safePersonalDetailValue_(values[key] == null ? '' : values[key]);
    });
    sheet.getRange(target + 1, 1, 1, headers.length).setValues([row]);
    SpreadsheetApp.flush();
    return { ok: true, userId: wanted, message: 'Personal details updated successfully.' };
  } finally {
    lock.releaseLock();
  }
}




/**
 * Add compatible property names to a profile object.
 * Supports normalized keys, original sheet headers, and common UI aliases.
 */
function addPersonalDetailsAliases_(item, headers, row) {
  headers.forEach((header, c) => {
    const originalHeader = String(header || '').trim();
    const key = personalDetailsHeaderKey_(originalHeader);

    if (!key) return;

    const value = row[c] == null ? '' : row[c];

    // Existing normalized property names: fullname, heightcm, etc.
    item[key] = value;

    // Exact spreadsheet header names: FullName, Height_cm, etc.
    item[originalHeader] = value;
  });

  // Consistent aliases for different frontend naming conventions.
  const aliases = {
    userid: ['userId', 'UserID'],
    fullname: ['fullName', 'FullName'],
    mobile: ['Mobile', 'mobileNo'],
    nationalid: ['NationalID', 'nationalId'],
    email: ['Email'],
    age: ['Age'],
    gender: ['Gender'],
    heightcm: ['height_cm', 'Height_cm', 'heightCm'],
    currentweightkg: [
      'currentWeight_kg', 'CurrentWeight_kg', 'currentWeightKg'
    ],
    dietprefernce: [
      'dietPrefernce', 'Diet Prefernce', 'dietPreference'
    ],
    country: ['Country'],
    healthconditions: ['healthConditions', 'Health conditions'],
    targetweightkg: [
      'targetWeight_kg', 'TargetWeight_kg', 'targetWeightKg'
    ],
    foodallergies: ['foodAllergies', 'FoodAllergies'],
    medicalconditions: ['medicalConditions', 'MedicalConditions'],
    sleephours: ['sleepHours', 'SleepHours'],
    waterintakel: ['waterIntake_L', 'WaterIntake_L', 'waterIntakeL'],
    exerciseminutes: [
      'exerciseMinutes', 'ExerciseMinutes'
    ]
  };

  Object.keys(aliases).forEach(key => {
    if (item[key] === undefined) return;

    aliases[key].forEach(alias => {
      item[alias] = item[key];
    });
  });

  return item;
}


/**
 * List profiles for the GridView.
 * Searches name, mobile, NationalID, email, and UserID.
 */
function listPersonalDetails(searchText) {
  const sheet = getPersonalDetailsSheet_();
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 2 || lastCol < 1) return [];

  const data = sheet
    .getRange(1, 1, lastRow, lastCol)
    .getDisplayValues();

  const headers = data[0].map(h => String(h || '').trim());
  const query = cleanPersonalDetail_(searchText).toLowerCase();
  const results = [];

  for (let r = 1; r < data.length; r++) {
    const row = data[r];

    if (!row.some(v => String(v || '').trim())) continue;

    const item = addPersonalDetailsAliases_(
      { rowNumber: r + 1 },
      headers,
      row
    );

    const searchable = [
      item.userid,
      item.fullname,
      item.mobile,
      item.nationalid,
      item.email
    ].join(' ').toLowerCase();

    if (!query || searchable.includes(query)) {
      results.push(item);
    }
  }

  // Newest records first.
  return results.reverse();
}


/**
 * Get one profile by UserID when a GridView row is selected.
 */
function getPersonalDetailsByUserId(userId) {
  const wanted = cleanPersonalDetail_(userId);

  if (!wanted) {
    throw new Error('Select a profile first.');
  }

  const sheet = getPersonalDetailsSheet_();
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 2 || lastCol < 1) {
    throw new Error('No personal details found.');
  }

  const data = sheet
    .getRange(1, 1, lastRow, lastCol)
    .getDisplayValues();

  const headers = data[0].map(h => String(h || '').trim());
  const map = personalDetailsHeaderMap_(headers);

  if (map.userid === undefined) {
    throw new Error('UserID column is missing.');
  }

  for (let r = 1; r < data.length; r++) {
    if (String(data[r][map.userid] || '').trim() !== wanted) {
      continue;
    }

    const result = addPersonalDetailsAliases_(
      { rowNumber: r + 1 },
      headers,
      data[r]
    );

    result.userid = wanted;
    result.userId = wanted;
    result.UserID = wanted;

    return result;
  }

  throw new Error(
    'Profile not found. Refresh the grid and try again.'
  );
}



/************************************************************
 * SMART NUTRITION DIET MANAGEMENT SYSTEM
 * DIGITAL TWIN FUNCTIONS FOR DietTwin.html
 *
 * PersonalDetails headers supported:
 * UserID, FullName, mobile, NationalID, Email, Age,
 * Gender, Height_cm, CurrentWeight_kg, Diet Prefernce,
 * Country, Health conditions, TargetWeight_kg,
 * FoodAllergies, MedicalConditions, SleepHours,
 * WaterIntake_L, ExerciseMinutes
 ************************************************************/

/* START DIGITAL TWIN — PERSONALDETAILS CONNECTION */
 

/* ============================================================
   SMART DIET NUTRITION MANAGEMENT
   DIET TWIN MODULE
   Google Sheet: PersonalDetails
   ============================================================ */

// Use the spreadsheet ID already configured for your project.
// Do not declare SPREADSHEET_ID again if it already exists.

const DT_SPREADSHEET_ID = '1YHn-mG807SP9Nvb2XGF3D8okvzefzf2kPhLyD79m4gQ';
const DT_SHEET_NAME = 'PersonalDetails';

function dtGetSheet_() {
  const ss = SpreadsheetApp.openById(DT_SPREADSHEET_ID);
  // Sheet names in Google Sheets are case-sensitive. Resolve case-insensitively
  // so PersonalDetails/persondetails naming differences do not break the page.
  const wanted = DT_SHEET_NAME.toLowerCase();
  const sheet = ss.getSheets().find(s => s.getName().trim().toLowerCase() === wanted);
  if (!sheet) {
    throw new Error('Could not find the PersonalDetails tab in spreadsheet ' + DT_SPREADSHEET_ID + '. Available tabs: ' + ss.getSheets().map(s => s.getName()).join(', '));
  }
  return sheet;
}

function dtKey(value) {
  return String(value == null ? '' : value)
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function dtColumn(headers, aliases) {
  const normalized = headers.map(dtKey);

  for (const alias of aliases) {
    const index = normalized.indexOf(dtKey(alias));
    if (index !== -1) return index;
  }

  return -1;
}

function dtFindHeader_(values) {
  const scanLimit = Math.min(values.length, 10);

  for (let i = 0; i < scanLimit; i++) {
    const headers = values[i];
    const nameCol = dtColumn(headers, [
      'FullName', 'Full Name', 'Full_Name', 'Name'
    ]);
    const idCol = dtColumn(headers, [
      'UserID', 'User ID', 'User_ID', 'UserIdentifier'
    ]);

    if (nameCol !== -1 && idCol !== -1) {
      return { headerRow: i, headers: headers };
    }
  }

  throw new Error(
    'Could not find a header row containing FullName and UserID. ' +
    'First rows checked: ' +
    JSON.stringify(values.slice(0, scanLimit))
  );
}
function dtText_(row, headers, aliases) {
  const col = dtColumn(headers, aliases);
  return col === -1
    ? ''
    : String(row[col] == null ? '' : row[col]).trim();
}

function dtNumber_(row, headers, aliases) {
  const raw = dtText_(row, headers, aliases);
  if (raw === '') return null;

  const value = Number(raw.replace(/,/g, ''));
  return Number.isFinite(value) ? value : null;
}

function getDigitalTwinUsers() {
  try {
    const sheet = dtGetSheet_();
    const values = sheet.getDataRange().getDisplayValues();

    if (!values.length) {
      return { ok: true, users: [], message: 'Sheet is empty.' };
    }

    const found = dtFindHeader_(values);
    const headers = found.headers;
    const headerRow = found.headerRow;

    const nameCol = dtColumn(headers, [
      'FullName', 'Full Name', 'Full_Name', 'Name'
    ]);
    const idCol = dtColumn(headers, [
      'UserID', 'User ID', 'User_ID', 'UserIdentifier'
    ]);
    const genderCol = dtColumn(headers, ['Gender', 'Sex']);

    const users = [];
    const seenIds = Object.create(null);

    for (let i = headerRow + 1; i < values.length; i++) {
      const row = values[i];
      const name = String(row[nameCol] || '').trim();
      if (!name) continue;

      const rawId = String(row[idCol] || '').trim();
      const id = rawId || ('ROW:' + (i + 1));

      if (seenIds[id]) continue;
      seenIds[id] = true;

      users.push({
        id: id,
        name: name,
        gender: genderCol < 0
          ? ''
          : String(row[genderCol] || '').trim()
      });
    }

    users.sort((a, b) => a.name.localeCompare(b.name));

    return {
      ok: true,
      users: users,
      message: users.length + ' names loaded from tab "' +
        sheet.getName() + '".'
    };
  } catch (error) {
    console.error('getDigitalTwinUsers failed: ' + error.stack);
    return {
      ok: false,
      users: [],
      message: error.message || String(error)
    };
  }
}

function getDigitalTwinData(selectedId) {
  try {
    const id = String(selectedId == null ? '' : selectedId).trim();
    if (!id) throw new Error('Please select a Full Name.');

    const sheet = dtGetSheet_();
    const values = sheet.getDataRange().getDisplayValues();
    const found = dtFindHeader_(values);
    const headers = found.headers;
    const headerRow = found.headerRow;

    const nameCol = dtColumn(headers, [
      'FullName', 'Full Name', 'Full_Name', 'Name'
    ]);
    const idCol = dtColumn(headers, [
      'UserID', 'User ID', 'User_ID', 'UserIdentifier'
    ]);

    let row = null;
    let sheetRow = -1;

    for (let i = headerRow + 1; i < values.length; i++) {
      const rawId = String(values[i][idCol] || '').trim();
      const rowId = rawId || ('ROW:' + (i + 1));

      if (rowId === id) {
        row = values[i];
        sheetRow = i + 1;
        break;
      }
    }

    if (!row) {
      throw new Error('Profile not found. Refresh the dropdown.');
    }

    const gender = dtText_(row, headers, ['Gender', 'Sex']);
    const height = dtNumber_(row, headers, [
      'Height_cm', 'Height cm', 'Height'
    ]);
    const weight = dtNumber_(row, headers, [
      'CurrentWeight_kg', 'Current Weight kg',
      'CurrentWeight', 'Weight_kg', 'Weight'
    ]);
    const targetWeight = dtNumber_(row, headers, [
      'TargetWeight_kg', 'Target Weight kg', 'TargetWeight'
    ]);

    const bmi = height > 0 && weight > 0
      ? Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10
      : null;

    const profile = {
      id: id,
      name: String(row[nameCol] || '').trim(),
      gender: gender,
      height: height,
      weight: weight,
      currentWeight: weight,
      targetWeight: targetWeight,
      bmi: bmi,
      dietPreference: dtText_(row, headers, [
        'DietPreference', 'Diet Preference', 'Diet Prefernce'
      ]),
      country: dtText_(row, headers, [
        'Country', 'CountryRegion', 'Country Region'
      ]),
      healthConditions: dtText_(row, headers, [
        'HealthConditions', 'Health Conditions'
      ]),
      medicalConditions: dtText_(row, headers, [
        'MedicalConditions', 'Medical Conditions'
      ]),
      foodAllergies: dtText_(row, headers, [
        'FoodAllergies', 'Food Allergies'
      ]),
      sleepHours: dtNumber_(row, headers, [
        'SleepHours', 'Sleep Hours'
      ]),
      waterIntake: dtNumber_(row, headers, [
        'WaterIntake_L', 'Water Intake L', 'WaterIntake'
      ]),
      exerciseMinutes: dtNumber_(row, headers, [
        'ExerciseMinutes', 'Exercise Minutes'
      ])
    };

    return {
      ok: true,
      profile: profile,
      message: 'Profile loaded successfully from row ' + sheetRow + '.'
    };
  } catch (error) {
    console.error('getDigitalTwinData failed: ' + error.stack);
    return {
      ok: false,
      message: error.message || String(error)
    };
  }
}

/** Run manually in Apps Script editor to verify sheet access and detected headers. */
function testDietTwinDataSource() {
  const sheet = dtGetSheet_();
  const result = getDigitalTwinUsers();
  Logger.log('Sheet: ' + sheet.getName());
  Logger.log('Headers: ' + sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].join(' | '));
  Logger.log(JSON.stringify(result));
  return result;
}

/* ======================= End of Diet Twin Functions ================ */

/* ============================================================
   8. WEIGHT HISTORY
   Retain this only if your existing Diet Twin page uses it.
   Reads weight values from PersonalDetails columns P:V.
   ============================================================ */

function dtReadHistory_(selectedId) {
  try {
    const sheet = dtGetSheet_();
    const data = sheet.getDataRange().getDisplayValues();

    if (data.length < 2) {
      return {
        ok: true,
        history: []
      };
    }

    const headers = data[0];

    const idCol = dtColumn(headers, [
      'UserID',
      'User ID'
    ]);

    const nameCol = dtColumn(headers, [
      'FullName',
      'Full Name'
    ]);

    let selectedRow = null;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];

      const rowId = idCol !== -1
        ? String(row[idCol] || '').trim()
        : String(i + 1);

      if (rowId === String(selectedId).trim()) {
        selectedRow = row;
        break;
      }
    }

    if (!selectedRow) {
      return {
        ok: false,
        history: [],
        message: 'Selected profile was not found.'
      };
    }

    const historyFields = [
      { label: 'Day 1', aliases: ['Day1'] },
      { label: 'Day 7', aliases: ['Day7'] },
      { label: 'Day 14', aliases: ['Day14'] },
      { label: 'Day 21', aliases: ['Day21'] },
      { label: 'Day 28', aliases: ['Day28'] }
    ];

    const history = [];

    historyFields.forEach(function (item) {
      const value = dtNumber_(
        selectedRow,
        headers,
        item.aliases
      );

      if (value !== null) {
        history.push({
          day: item.label,
          weight: value
        });
      }
    });

    return {
      ok: true,
      history: history
    };

  } catch (error) {
    console.error('dtReadHistory_:', error);

    return {
      ok: false,
      history: [],
      message: error.message
    };
  }
}


/* ============================================================
   9. DEPLOYED WEB APP URL
   Used by the Diet Twin Admin Panel button.
   ============================================================ */

function getDietTwinWebAppUrl() {
  return ScriptApp.getService().getUrl();
}



/* =========================================
   START 30-DAY DIET PLAN - SERVER FUNCTIONS
   ========================================= */

const DP30_SPREADSHEET_ID = "1YHn-mG807SP9Nvb2XGF3D8okvzefzf2kPhLyD79m4gQ";

const DP30_PERSONAL_SHEET = "PersonalDetails";

/** Normalize headers consistently. */
function dp30Key(value) {
  return String(value == null ? "" : value)
    .trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Find a column using alternative header names. */
function dp30FindColumn(headers, aliases) {
  const keys = aliases.map(dp30Key);
  return headers.findIndex(function(header) {
    return keys.indexOf(header) !== -1;
  });
}

/** Read PersonalDetails and map the profile fields. */
function dp30GetProfiles_() {
  const ss = SpreadsheetApp.openById(DP30_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(DP30_PERSONAL_SHEET);

  if (!sheet) {
    throw new Error('Sheet "' + DP30_PERSONAL_SHEET + '" not found.');
  }

  const values = sheet.getDataRange().getDisplayValues();

  if (values.length < 2) {
    return { ss: ss, headers: [], profiles: [] };
  }

  const rawHeaders = values[0];
  const headers = rawHeaders.map(dp30Key);

  const columns = {
    id: dp30FindColumn(headers, ["UserID", "User ID"]),
    name: dp30FindColumn(headers, ["FullName", "Full Name"]),
    height: dp30FindColumn(headers, ["Height_cm", "Height cm", "Height"]),
    weight: dp30FindColumn(headers, [
      "CurrentWeight_kg", "Current Weight kg", "CurrentWeight"
    ]),
    diet: dp30FindColumn(headers, [
      "Diet Prefernce", "Diet Preference", "DietPreference"
    ]),
    country: dp30FindColumn(headers, ["Country"]),
    health: dp30FindColumn(headers, [
      "Health conditions", "HealthConditions"
    ]),
    target: dp30FindColumn(headers, [
      "TargetWeight_kg", "Target Weight kg", "TargetWeight"
    ]),
    allergies: dp30FindColumn(headers, [
      "FoodAllergies", "Food Allergies"
    ]),
    medical: dp30FindColumn(headers, [
      "MedicalConditions", "Medical Conditions"
    ]),
    sleep: dp30FindColumn(headers, ["SleepHours", "Sleep Hours"]),
    water: dp30FindColumn(headers, ["WaterIntake_L", "Water Intake L"]),
    exercise: dp30FindColumn(headers, [
      "ExerciseMinutes", "Exercise Minutes"
    ])
  };

  if (columns.name < 0) {
    throw new Error(
      "FullName header not found. Found headers: " + rawHeaders.join(" | ")
    );
  }

  function cell(row, key) {
    return columns[key] < 0 ? "" : String(row[columns[key]] || "").trim();
  }

  const profiles = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const name = cell(row, "name");
    if (!name) continue;

    profiles.push({
      id: cell(row, "id") || name,
      name: name,
      height: cell(row, "height"),
      weight: cell(row, "weight"),
      dietPreference: cell(row, "diet"),
      country: cell(row, "country"),
      healthConditions: cell(row, "health"),
      targetWeight: cell(row, "target"),
      foodAllergies: cell(row, "allergies"),
      medicalConditions: cell(row, "medical"),
      sleepHours: cell(row, "sleep"),
      waterIntake: cell(row, "water"),
      exerciseMinutes: cell(row, "exercise")
    });
  }

  return { ss: ss, headers: rawHeaders, profiles: profiles };
}

/** Populate the HTML Full Name dropdown. */
function getDietPlanUsers() {
  try {
    const result = dp30GetProfiles_();

    return {
      ok: true,
      users: result.profiles.map(function(p) {
        return { id: p.id, name: p.name };
      }),
      message: result.profiles.length + " profile(s) loaded."
    };
  } catch (e) {
    console.error("getDietPlanUsers: " + e.message);
    return { ok: false, users: [], message: e.message };
  }
}

/** Load one person's profile for the diet planner. */
function getDietPlanProfile(selectedId) {
  try {
    if (!selectedId) throw new Error("Select a Full Name.");

    const result = dp30GetProfiles_();
    const wanted = String(selectedId).trim().toLowerCase();

    const profile = result.profiles.find(function(p) {
      return String(p.id).trim().toLowerCase() === wanted ||
             String(p.name).trim().toLowerCase() === wanted;
    });

    if (!profile) throw new Error("Selected profile was not found.");

    const height = Number(profile.height);
    const weight = Number(profile.weight);
    const target = Number(profile.targetWeight);

    profile.bmi = height > 0 && weight > 0
      ? weight / Math.pow(height / 100, 2)
      : 0;

    profile.targetBmi = height > 0 && target > 0
      ? target / Math.pow(height / 100, 2)
      : 0;

    profile.weightDifference = weight > 0 && target > 0
      ? weight - target
      : 0;

    profile.ok = true;
    return profile;
  } catch (e) {
    console.error("getDietPlanProfile: " + e.message);
    return { ok: false, message: e.message };
  }
}

/* ==============  END of DIET PLAN FUNCTUION ======================== */



/* ======== START WEIGHT TRACKING ==================================== */

/**
 * Weight Tracking support functions.
 * Merge these into your existing Code.gs; do not create a second doGet(e).
 * Required sheets:
 *   PersonalDetails: headers include UserID and FullName (case-insensitive)
 *   WeightTracking: RecordID | UserID | RecordDate | Weight_kg | Waist_cm | Notes
 */

/** Returns FullName/UserID choices from the existing Digital Twin function if available,
 * otherwise reads the PersonalDetails sheet by header name. */

function getWeightTrackingUsers() {
  // Reuse the established project helper when it exists and returns the expected shape.
  try {
    if (typeof getDigitalTwinUsers === 'function') {
      var existing = getDigitalTwinUsers();
      if (existing && existing.ok === true && Array.isArray(existing.users)) {
        var mapped = existing.users.map(function (u) {
          return { id: String(u.id || '').trim(), name: String(u.name || '').trim() };
        }).filter(function (u) { return u.id && u.name; });
        mapped.sort(function (a, b) { return a.name.localeCompare(b.name); });
        return { ok: true, users: mapped, message: mapped.length + ' names loaded.' };
      }
    }
  } catch (ignored) {
    // Use direct sheet lookup below if the existing helper is not compatible.
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No active spreadsheet. Bind the script to the spreadsheet or use openById().');
  var sheet = ss.getSheetByName('PersonalDetails');
  if (!sheet || sheet.getLastRow() < 2) {
    return { ok: true, users: [], message: 'PersonalDetails sheet is missing or contains no data rows.' };
  }
  var data = sheet.getDataRange().getDisplayValues();
  var headers = data[0].map(function (h) { return String(h).trim().toLowerCase().replace(/[ _-]/g, ''); });
  var idCol = headers.indexOf('userid');
  var nameCol = headers.indexOf('fullname');
  if (idCol < 0 || nameCol < 0) {
    throw new Error('PersonalDetails must contain columns named UserID and FullName.');
  }
  var seen = {};
  var users = [];
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][idCol] || '').trim();
    var name = String(data[i][nameCol] || '').trim();
    if (!id || !name || seen[id]) continue;
    seen[id] = true;
    users.push({ id: id, name: name });
  }
  users.sort(function (a, b) { return a.name.localeCompare(b.name); });
  return { ok: true, users: users, message: users.length + ' names loaded from PersonalDetails.' };
}

function initializeWeightTrackingSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No active spreadsheet. Bind this script to the spreadsheet or configure a spreadsheet ID.');
  var sheet = ss.getSheetByName('WeightTracking');
  if (!sheet) sheet = ss.insertSheet('WeightTracking');
  var headers = ['RecordID', 'UserID', 'RecordDate', 'Weight_kg', 'Waist_cm', 'Notes'];
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  } else {
    var existing = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getDisplayValues()[0];
    var actual = existing.slice(0, headers.length).map(function (v) { return String(v).trim(); });
    if (headers.some(function (h, i) { return actual[i] !== h; })) {
      throw new Error('WeightTracking sheet headers must be: ' + headers.join(', '));
    }
  }
  return { ok: true, sheetName: sheet.getName() };
}

/** Exact UserID filtering; blank userId returns no records to avoid exposing all users. */
function getWeightTrackingRecords(userId) {
  var filter = String(userId || '').trim();
  if (!filter) return [];
  initializeWeightTrackingSheet();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WeightTracking');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  var records = values.map(function (row) {
    return {
      recordId: String(row[0] || ''),
      userId: String(row[1] || ''),
      recordDate: row[2] instanceof Date
        ? Utilities.formatDate(row[2], Session.getScriptTimeZone(), 'yyyy-MM-dd')
        : normalizeWeightDate_(row[2]),
      weightKg: row[3] === '' || row[3] === null ? '' : Number(row[3]),
      waistCm: row[4] === '' || row[4] === null ? '' : Number(row[4]),
      notes: String(row[5] || '')
    };
  }).filter(function (r) { return r.recordId && r.userId === filter; });
  records.sort(function (a, b) {
    return String(b.recordDate).localeCompare(String(a.recordDate)) || String(b.recordId).localeCompare(String(a.recordId));
  });
  return records;
}

/** Inserts a new row or updates a row by RecordID. UserID must be present in PersonalDetails. */
function saveWeightTrackingRecord(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid measurement data.');
  var userId = String(payload.userId || '').trim();
  var recordDate = String(payload.recordDate || '').trim();
  var weight = Number(payload.weightKg);
  var waistRaw = String(payload.waistCm === undefined || payload.waistCm === null ? '' : payload.waistCm).trim();
  var waist = waistRaw === '' ? '' : Number(waistRaw);
  var notes = String(payload.notes || '').trim();
  var recordId = String(payload.recordId || '').trim();

  if (!userId) throw new Error('Select a Full Name before saving.');
  var usersResult = getWeightTrackingUsers();
  var validUser = usersResult.users.some(function (u) { return String(u.id) === userId; });
  if (!validUser) throw new Error('The selected user was not found in PersonalDetails. Refresh the page and select a name again.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(recordDate) || isNaN(new Date(recordDate + 'T12:00:00').getTime())) throw new Error('Enter a valid record date.');
  if (!isFinite(weight) || weight < 1 || weight > 500) throw new Error('Weight must be between 1 and 500 kg.');
  if (waistRaw !== '' && (!isFinite(waist) || waist < 1 || waist > 300)) throw new Error('Waist must be between 1 and 300 cm.');
  if (notes.length > 1000) throw new Error('Notes cannot exceed 1,000 characters.');

  var lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    initializeWeightTrackingSheet();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('WeightTracking');
    var lastRow = sheet.getLastRow();
    var targetRow = -1;
    if (recordId && lastRow >= 2) {
      var data = sheet.getRange(2, 1, lastRow - 1, 2).getDisplayValues();
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][0]).trim() === recordId) {
          if (String(data[i][1]).trim() !== userId) throw new Error('You can only edit records belonging to the selected Full Name.');
          targetRow = i + 2;
          break;
        }
      }
      if (targetRow < 0) throw new Error('The record being edited was not found. Refresh the page and try again.');
    } else {
      recordId = Utilities.getUuid();
      targetRow = sheet.getLastRow() + 1;
    }
    sheet.getRange(targetRow, 1, 1, 6).setValues([[recordId, userId, new Date(recordDate + 'T12:00:00'), weight, waist, notes]]);
    sheet.getRange(targetRow, 3).setNumberFormat('yyyy-mm-dd');
    return { ok: true, recordId: recordId, message: payload.recordId ? 'Measurement updated successfully.' : 'Measurement saved successfully.' };
  } finally {
    lock.releaseLock();
  }
}

function normalizeWeightDate_(value) {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.substring(0, 10);
  var d = new Date(value);
  return isNaN(d.getTime()) ? String(value) : Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}


/* ================ START REPORT ====================== */


const REPORT_CONFIG = {
  PERSONAL_SHEET: 'PersonalDetails',
  REPORT_SHEETS: {
    'Personal Details': 'PersonalDetails',
    'Diet Plan': 'DietPlans',
    'Weight History': 'WeightTracking'
  }
};



/**
 * Gets the available full names from PersonalDetails.
 */
function getInitialData() {
  const sheet = getSheet_(REPORT_CONFIG.PERSONAL_SHEET);
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return { fullNames: [], reportTypes: Object.keys(REPORT_CONFIG.REPORT_SHEETS) };
  }

  const headers = data[0];
  const nameIndex = findHeaderIndex_(headers, ['Fullname', 'Full Name', 'Name']);

  if (nameIndex === -1) {
    throw new Error('Fullname column was not found in PersonalDetails.');
  }

  const names = [...new Set(
    data.slice(1)
      .map(row => String(row[nameIndex] || '').trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));

  return {
    fullNames: names,
    reportTypes: Object.keys(REPORT_CONFIG.REPORT_SHEETS)
  };
}

/**
 * Returns report rows for the selected person and report.
 *
 * filters = {
 *   fromDate: '2026-01-01',
 *   toDate: '2026-12-31',
 *   search: 'keyword'
 * }
 */

function getReportData(fullName, reportType, filters) {
  if (!fullName || !String(fullName).trim()) {
    throw new Error('Please select a full name.');
  }

  const sheetName = REPORT_CONFIG.REPORT_SHEETS[reportType];
  if (!sheetName) {
    throw new Error('Invalid report type selected: ' + reportType);
  }

  filters = filters || {};

  const fromDate = filters.fromDate || '';
  const toDate = filters.toDate || '';
  const search = String(filters.search || '').trim().toLowerCase();

  if (fromDate && toDate && fromDate > toDate) {
    throw new Error('From date cannot be later than To date.');
  }

  // Weight History: link WeightTracking to PersonalDetails using UserID.
  if (reportType === 'Weight History') {
    return getWeightHistoryReport_(fullName, filters);
  }

  // Other reports: filter by Fullname.
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();

  if (!values.length || !values[0].length) {
    return {
      headers: [],
      rows: [],
      total: 0,
      reportType: reportType,
      fullName: String(fullName)
    };
  }

  const headers = values[0].map(String);
  const nameIndex = findHeaderIndex_(
    headers, ['Fullname', 'Full Name', 'Name']
  );

  if (nameIndex === -1) {
    throw new Error('Fullname column is missing in ' + sheetName + '.');
  }

  const dateIndex = findHeaderIndex_(
    headers, ['Date', 'Record Date', 'Entry Date']
  );

  const rows = values.slice(1)
    .filter(row => {
      if (
        String(row[nameIndex] || '').trim().toLowerCase() !==
        String(fullName).trim().toLowerCase()
      ) {
        return false;
      }

      if (dateIndex !== -1 && (fromDate || toDate)) {
        const date = normalizeDate_(row[dateIndex]);
        if (!date) return false;
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
      }

      if (search && !row.some(value =>
        formatValue_(value).toLowerCase().includes(search)
      )) {
        return false;
      }

      return true;
    })
    .map(row => row.map(formatValue_));

  return {
    headers: headers,
    rows: rows,
    total: rows.length,
    reportType: reportType,
    fullName: String(fullName)
  };
}


/**
 * Retrieves a sheet by name with a helpful error.
 */
function getSheet_(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Sheet "' + sheetName + '" was not found.');
  }

  return sheet;
}

/**
 * Finds a header, ignoring spaces, underscores and case.
 */
function findHeaderIndex_(headers, possibleNames) {
  const normalize = value =>
    String(value).toLowerCase().replace(/[\s_-]/g, '');

  const candidates = possibleNames.map(normalize);
  return headers.findIndex(header =>
    candidates.includes(normalize(header))
  );
}

/**
 * Converts sheet values into safe, consistent text values.
 */
function formatValue_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(
      value,
      SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(),
      'yyyy-MM-dd'
    );
  }

  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Returns a date as yyyy-MM-dd, or an empty string if invalid.
 */
function normalizeDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(
      value,
      SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(),
      'yyyy-MM-dd'
    );
  }

  if (value === null || value === undefined || value === '') return '';

  const text = String(value).trim();

  // Handles ISO date strings and common sheet date text.
  const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return iso[1] + '-' +
      iso[2].padStart(2, '0') + '-' +
      iso[3].padStart(2, '0');
  }

  const parsed = new Date(text);
  if (isNaN(parsed.getTime())) return '';

  return Utilities.formatDate(
    parsed,
    SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(),
    'yyyy-MM-dd'
  );
}


function getWeightHistoryReport_(fullName, filters) {
  const peopleSheet = getSheet_('PersonalDetails');
  const peopleData = peopleSheet.getDataRange().getValues();

  if (peopleData.length < 2) {
    return {
      headers: [],
      rows: [],
      total: 0,
      reportType: 'Weight History',
      fullName: String(fullName)
    };
  }

  const peopleHeaders = peopleData[0].map(String);

  const personNameIndex = findHeaderIndex_(
    peopleHeaders, ['Fullname', 'Full Name', 'Name']
  );

  const personUserIdIndex = findHeaderIndex_(
    peopleHeaders, ['UserID', 'User ID', 'User_Id']
  );

  if (personNameIndex === -1) {
    throw new Error('Fullname column is missing in PersonalDetails.');
  }

  if (personUserIdIndex === -1) {
    throw new Error(
      'UserID column is missing in PersonalDetails. ' +
      'Weight History requires UserID in both sheets.'
    );
  }

  const selectedName = String(fullName).trim().toLowerCase();

  const matchingPeople = peopleData.slice(1).filter(row =>
    String(row[personNameIndex] || '').trim().toLowerCase() ===
    selectedName
  );

  if (!matchingPeople.length) {
    throw new Error('Selected person was not found in PersonalDetails.');
  }

  const userIds = new Set(
    matchingPeople
      .map(row => String(row[personUserIdIndex] || '').trim())
      .filter(Boolean)
  );

  if (!userIds.size) {
    throw new Error(
      'No UserID found for ' + fullName + ' in PersonalDetails.'
    );
  }

  const weightSheet = getSheet_('WeightTracking');
  const weightData = weightSheet.getDataRange().getValues();

  if (!weightData.length || !weightData[0].length) {
    return {
      headers: [],
      rows: [],
      total: 0,
      reportType: 'Weight History',
      fullName: String(fullName)
    };
  }

  const weightHeaders = weightData[0].map(String);

  const weightUserIdIndex = findHeaderIndex_(
    weightHeaders, ['UserID', 'User ID', 'User_Id']
  );

  const weightDateIndex = findHeaderIndex_(
    weightHeaders, ['RecordDate', 'Record Date', 'Date']
  );

  if (weightUserIdIndex === -1) {
    throw new Error('UserID column is missing in WeightTracking.');
  }

  const filtersObj = filters || {};
  const fromDate = filtersObj.fromDate || '';
  const toDate = filtersObj.toDate || '';
  const search = String(filtersObj.search || '').trim().toLowerCase();

  // Add Fullname as a display column without changing the spreadsheet.
  const outputHeaders = ['Fullname'].concat(weightHeaders);

  const rows = weightData.slice(1)
    .filter(row => {
      const userId = String(row[weightUserIdIndex] || '').trim();

      if (!userIds.has(userId)) return false;

      if (weightDateIndex !== -1 && (fromDate || toDate)) {
        const date = normalizeDate_(row[weightDateIndex]);

        if (!date) return false;
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
      }

      if (search) {
        const matchesName = String(fullName)
          .toLowerCase().includes(search);

        const matchesRow = row.some(value =>
          formatValue_(value).toLowerCase().includes(search)
        );

        if (!matchesName && !matchesRow) return false;
      }

      return true;
    })
    .map(row => [String(fullName)].concat(row.map(formatValue_)));

  return {
    headers: outputHeaders,
    rows: rows,
    total: rows.length,
    reportType: 'Weight History',
    fullName: String(fullName)
  };
}



/* ================ START HELP SUPPORT ============================= *? */
/**
 * DietTwin Help & Support backend.
 *
 * Public methods:
 *   submitHelpSupportRequest(payload) - saves a ticket.
 *   getHelpSupportRequests() - returns a limited, privacy-safe ticket listing.
 *
 * Administrator-only method:
 *   updateHelpSupportRequest(payload) - updates a ticket after checking the
 *   HELP_SUPPORT_ADMIN_EMAILS Script Property.
 *
 * Do not remove the server-side admin check from updateHelpSupportRequest().
 * If your project already has doGet(e), merge the AdminDashboard/HelpSupport
 * page cases into that existing router; do not create a duplicate doGet().
 */
const HELP_SUPPORT_CONFIG = {
  SPREADSHEET_ID: '1YHn-mG807SP9Nvb2XGF3D8okvzefzf2kPhLyD79m4gQ',
  SHEET_NAME: 'HelpSupport'
};

const HELP_SUPPORT_HEADERS = [
  'Timestamp', 'Ticket ID', 'Submitted', 'Customer',
  'Subject', 'Priority', 'Status', 'Action'
];

const HELP_SUPPORT_CATEGORIES = [
  'General Enquiry', 'Technical Issue', 'Account Issue',
  'Billing', 'Feedback', 'Other'
];
const HELP_SUPPORT_PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];
const HELP_SUPPORT_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

/** Save a support request to the configured HelpSupport tab. */
function submitHelpSupportRequest(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Please complete the form and try again.');
    }

    const fullName = helpSupportClean_(payload.fullName, 120);
    const email = helpSupportClean_(payload.email, 254);
    const category = helpSupportClean_(payload.category, 100);
    const priority = helpSupportClean_(payload.priority || 'Normal', 20);
    const subject = helpSupportClean_(payload.subject, 200);
    const message = helpSupportClean_(payload.message, 10000);

    if (!fullName || !email || !category || !subject || !message) {
      throw new Error('Please complete all required fields.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.');
    }
    if (message.length < 10) {
      throw new Error('Please provide at least 10 characters in the description.');
    }
    if (!HELP_SUPPORT_PRIORITIES.includes(priority)) {
      throw new Error('Please select a valid priority.');
    }
    if (!HELP_SUPPORT_CATEGORIES.includes(category)) {
      throw new Error('Please select a valid support topic.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    let sheet;
    let ticketId;
    let targetRow;
    try {
      sheet = getHelpSupportSheet_();
      const now = new Date();
      ticketId = 'DT-' + Utilities.formatDate(
        now, Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss'
      ) + '-' + Utilities.getUuid().substring(0, 6).toUpperCase();

      const submittedDetails = category + '\n' + message;
      const customerDetails = fullName + '\n' + email;
      targetRow = Math.max(sheet.getLastRow() + 1, 2);

      sheet.getRange(targetRow, 1, 1, 8).setValues([[
        now,
        ticketId,
        helpSupportSheetSafe_(submittedDetails),
        helpSupportSheetSafe_(customerDetails),
        helpSupportSheetSafe_(subject),
        priority,
        'Open',
        ''
      ]]);
      SpreadsheetApp.flush();

      const savedTicketId = String(
        sheet.getRange(targetRow, 2).getDisplayValue()
      ).trim();
      if (savedTicketId !== ticketId) {
        throw new Error(
          'The request was written but could not be verified in row ' +
          targetRow + '. Check the target sheet and edit permissions.'
        );
      }
    } finally {
      lock.releaseLock();
    }

    return {
      success: true,
      ticketId: ticketId,
      spreadsheetUrl: sheet.getParent().getUrl(),
      spreadsheetName: sheet.getParent().getName(),
      sheetName: sheet.getName(),
      savedRow: targetRow,
      message: 'Request submitted successfully. Ticket ID: ' + ticketId + '.'
    };
  } catch (error) {
    console.error('Help Support submission failed:', error);
    return {
      success: false,
      message: error && error.message
        ? error.message
        : 'Unable to submit your request. Please try again.'
    };
  }
}

/**
 * Public-safe grid data. This intentionally does NOT require admin access,
 * and intentionally does NOT return names, emails, message text, or subject.
 * The grid can therefore refresh for ordinary users without exposing
 * customers' personal support details.
 */
function getHelpSupportRequests() {
  const sheet = getHelpSupportSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  const requests = rows.map(function(row) {
    const submittedDetails = String(row[2] == null ? '' : row[2]);
    const category = submittedDetails.split('\n')[0] || '';
    const timestamp = row[0] instanceof Date
      ? row[0].toISOString()
      : String(row[0] == null ? '' : row[0]);

    return {
      timestamp: timestamp,
      ticketId: String(row[1] == null ? '' : row[1]),
      category: category,
      priority: String(row[5] || 'Normal'),
      status: String(row[6] || 'Open')
    };
  }).filter(function(request) {
    return Boolean(request.ticketId);
  });

  // Newest tickets first.
  return requests.reverse();
}

/**
 * Administrator-only full records for AdminDashboard.html.
 * If AdminDashboard currently calls getHelpSupportRequests(), change that
 * call to getHelpSupportAdminRequests() so its private detail grid remains protected.
 */
function getHelpSupportAdminRequests() {
  requireHelpSupportAdmin_();
  const sheet = getHelpSupportSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
  return rows.map(function(row, index) {
    const submittedLines = String(row[2] == null ? '' : row[2]).split('\n');
    const customerLines = String(row[3] == null ? '' : row[3]).split('\n');
    return {
      rowNumber: index + 2,
      timestamp: row[0] instanceof Date
        ? row[0].toISOString()
        : String(row[0] == null ? '' : row[0]),
      ticketId: String(row[1] == null ? '' : row[1]),
      category: submittedLines.shift() || '',
      message: submittedLines.join('\n'),
      fullName: customerLines.shift() || '',
      email: customerLines.join('\n'),
      subject: String(row[4] == null ? '' : row[4]),
      priority: String(row[5] || 'Normal'),
      status: String(row[6] || 'Open'),
      action: String(row[7] == null ? '' : row[7])
    };
  }).filter(function(request) {
    return Boolean(request.ticketId);
  }).reverse();
}

/** Return the deployed web-app URL for reliable AdminDashboard navigation. */
function getWebAppUrl() {
  const url = ScriptApp.getService().getUrl();
  if (!url) {
    throw new Error('No deployed web-app URL is available. Deploy this project as a web app first.');
  }
  return url;
}

/** Return the configured spreadsheet's HelpSupport sheet, validating headers. */
function getHelpSupportSheet_() {
  const configuredId = String(HELP_SUPPORT_CONFIG.SPREADSHEET_ID || '').trim();
  let spreadsheet = null;

  if (configuredId) {
    spreadsheet = SpreadsheetApp.openById(configuredId);
  } else {
    try {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    } catch (ignored) {
      spreadsheet = null;
    }
  }

  if (!spreadsheet) {
    throw new Error(
      'No target spreadsheet is configured. Set HELP_SUPPORT_CONFIG.SPREADSHEET_ID.'
    );
  }

  const sheet = spreadsheet.getSheetByName(HELP_SUPPORT_CONFIG.SHEET_NAME);
  if (!sheet) {
    throw new Error(
      'The spreadsheet ' + spreadsheet.getName() +
      ' does not contain a tab named ' + HELP_SUPPORT_CONFIG.SHEET_NAME + '.'
    );
  }

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HELP_SUPPORT_HEADERS.length)
      .setValues([HELP_SUPPORT_HEADERS]);
    sheet.setFrozenRows(1);
  } else {
    const width = Math.max(sheet.getLastColumn(), HELP_SUPPORT_HEADERS.length);
    const actualHeaders = sheet.getRange(1, 1, 1, width)
      .getDisplayValues()[0].map(function(value) {
        return String(value).trim();
      });
    const mismatch = HELP_SUPPORT_HEADERS.some(function(header, index) {
      return actualHeaders[index] !== header;
    });
    if (mismatch) {
      throw new Error(
        'The HelpSupport header row must be: ' + HELP_SUPPORT_HEADERS.join(', ') + '.'
      );
    }
  }

  return sheet;
}

/** Configure Script Property HELP_SUPPORT_ADMIN_EMAILS with comma-separated emails. */
function requireHelpSupportAdmin_() {
  const allowedEmails = PropertiesService.getScriptProperties()
    .getProperty('HELP_SUPPORT_ADMIN_EMAILS') || '';
  const activeUser = Session.getActiveUser().getEmail();
  const currentEmail = String(activeUser || '').trim().toLowerCase();
  const admins = allowedEmails.split(',').map(function(email) {
    return email.trim().toLowerCase();
  }).filter(Boolean);

  if (!admins.length || !currentEmail || !admins.includes(currentEmail)) {
    throw new Error(
      'Access denied. An authorized administrator must sign in to manage support requests.'
    );
  }
  return currentEmail;
}

/** Update an existing request. This function remains administrator-only. */
function updateHelpSupportRequest(payload) {
  requireHelpSupportAdmin_();

  if (!payload || !String(payload.ticketId || '').trim()) {
    throw new Error('Ticket ID is required.');
  }

  const ticketId = String(payload.ticketId).trim();
  const category = helpSupportClean_(payload.category, 100);
  const priority = helpSupportClean_(payload.priority, 20);
  const subject = helpSupportClean_(payload.subject, 200);
  const message = helpSupportClean_(payload.message, 10000);
  const status = helpSupportClean_(payload.status, 30);

  if (!HELP_SUPPORT_STATUSES.includes(status)) throw new Error('Invalid request status.');
  if (!HELP_SUPPORT_PRIORITIES.includes(priority)) throw new Error('Invalid request priority.');
  if (!HELP_SUPPORT_CATEGORIES.includes(category)) throw new Error('Invalid request category.');
  if (!subject || !message) throw new Error('Subject and message are required.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getHelpSupportSheet_();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) throw new Error('Support request not found. Refresh and try again.');

    const ids = sheet.getRange(2, 2, lastRow - 1, 1).getDisplayValues();
    let targetRow = -1;
    for (let i = 0; i < ids.length; i++) {
      if (String(ids[i][0]).trim() === ticketId) {
        targetRow = i + 2;
        break;
      }
    }
    if (targetRow < 0) {
      throw new Error('Support request not found. Refresh the grid and try again.');
    }

    sheet.getRange(targetRow, 3).setValue(
      helpSupportSheetSafe_(category + '\n' + message)
    );
    sheet.getRange(targetRow, 5).setValue(helpSupportSheetSafe_(subject));
    sheet.getRange(targetRow, 6).setValue(priority);
    sheet.getRange(targetRow, 7).setValue(status);
    SpreadsheetApp.flush();

    return {
      success: true,
      ticketId: ticketId,
      message: 'Support request ' + ticketId + ' updated successfully.'
    };
  } finally {
    lock.releaseLock();
  }
}

/** Diagnostic helper; logs destination and current row count without writing data. */
function diagnoseHelpSupportDestination() {
  const sheet = getHelpSupportSheet_();
  const result = {
    spreadsheetName: sheet.getParent().getName(),
    spreadsheetUrl: sheet.getParent().getUrl(),
    sheetName: sheet.getName(),
    lastRow: sheet.getLastRow(),
    headers: sheet.getRange(1, 1, 1, 8).getDisplayValues()[0]
  };
  return result;
}

/** Clean input values and enforce a maximum length. */
function helpSupportClean_(value, maxLength) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .substring(0, maxLength);
}

/** Prevent form input from being interpreted as a spreadsheet formula. */
function helpSupportSheetSafe_(value) {
  const text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

/** Return the configured spreadsheet URL. */
function openHelpSupportSpreadsheetUrl() {
  const sheet = getHelpSupportSheet_();
  return sheet.getParent().getUrl();
}
