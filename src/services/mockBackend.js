// Lightweight mock backend using localStorage to simulate persistent API
const DB_KEY = 'grahmind_mock_db_v1'

function _readDb() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    return raw ? JSON.parse(raw) : { profile: {} }
  } catch (e) {
    return { profile: {} }
  }
}

function _writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

function _ensureArray(obj, key) {
  if (!obj[key]) obj[key] = []
}

function delay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms))
}

export async function initFromProfile(profile) {
  const db = _readDb()
  db.profile = { ...(db.profile || {}), ...(profile || {}) }
  _ensureArray(db.profile, 'projects')
  _ensureArray(db.profile, 'updates')
  _ensureArray(db.profile, 'attendance')
  _ensureArray(db.profile, 'applications')
  _writeDb(db)
  await delay(80)
  return db.profile
}

export async function addProject(project) {
  const db = _readDb()
  _ensureArray(db.profile, 'projects')
  db.profile.projects.push(project)
  _writeDb(db)
  await delay()
  return db.profile.projects
}

export async function updateProjects(projects) {
  const db = _readDb()
  db.profile.projects = projects
  _writeDb(db)
  await delay()
  return db.profile.projects
}

export async function addUpdate(entry) {
  const db = _readDb()
  _ensureArray(db.profile, 'updates')
  db.profile.updates.unshift(entry)
  _writeDb(db)
  await delay()
  return db.profile.updates
}

export async function updateUpdates(updates) {
  const db = _readDb()
  db.profile.updates = updates
  _writeDb(db)
  await delay()
  return db.profile.updates
}

export async function addAttendance(entry) {
  const db = _readDb()
  _ensureArray(db.profile, 'attendance')
  db.profile.attendance.unshift(entry)
  _writeDb(db)
  await delay()
  return db.profile.attendance
}

export async function updateAttendance(attendance) {
  const db = _readDb()
  db.profile.attendance = attendance
  _writeDb(db)
  await delay()
  return db.profile.attendance
}

export async function addApplication(app) {
  const db = _readDb()
  _ensureArray(db.profile, 'applications')
  db.profile.applications.push(app)
  _writeDb(db)
  await delay()
  return db.profile.applications
}

export async function updateApplications(apps) {
  const db = _readDb()
  db.profile.applications = apps
  _writeDb(db)
  await delay()
  return db.profile.applications
}

export async function saveProfile(patch) {
  const db = _readDb()
  db.profile = { ...(db.profile || {}), ...patch }
  _writeDb(db)
  await delay()
  return db.profile
}

export async function setSetting(key, value) {
  const db = _readDb()
  db.profile = { ...(db.profile || {}), settings: { ...(db.profile.settings || {}), [key]: value } }
  _writeDb(db)
  await delay()
  return db.profile.settings
}

export async function inviteMember(member) {
  // store in members list
  const db = _readDb()
  _ensureArray(db.profile, 'members')
  db.profile.members.push(member)
  _writeDb(db)
  await delay()
  return db.profile.members
}

export default {
  initFromProfile,
  addProject,
  updateProjects,
  addUpdate,
  updateUpdates,
  addAttendance,
  updateAttendance,
  addApplication,
  updateApplications,
  saveProfile,
  setSetting,
  inviteMember,
}
