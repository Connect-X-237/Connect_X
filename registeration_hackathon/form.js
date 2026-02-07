import { createTeam } from './teams.api.js'

const form = document.getElementById('form')
const teamNameInput = document.getElementById('teamName')

let members = []
let currentMember = 0
let teamSize = 0

/* ======================REGEX====================== */
const phoneRegex = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const idRegex = /^\d{6,}$/

/* ======================FORM SUBMIT====================== */
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (teamSize === 0) {
    const size = document.querySelector('input[name="teamSize"]:checked')?.value
    if (!size) return alert('Choose team size')
    teamSize = +size
    members = Array(teamSize).fill({})
    showMemberForm(currentMember)
    return
  }
  if (currentMember < teamSize) {
    const errorMsg = validateMember(currentMember)
    if (errorMsg) return alert(errorMsg)

    currentMember++
    if (currentMember < teamSize) {
      showMemberForm(currentMember)
    } else {
      showSubmitButton()
    }
  }
})

/* ======================SHOW MEMBER FORM====================== */
function showMemberForm(i) {
  const member = members[i] || {}
  form.innerHTML = `
    <h3>Member ${i + 1}</h3>
    <input placeholder="Full Name" data-i="${i}" data-f="full_name" class="member my-input" required type="text" value="${member.full_name || ''}"/>
    <input placeholder="Phone" data-i="${i}" data-f="phone" class="member my-input" required type="tel" value="${member.phone || ''}"/>
    <input placeholder="Email" data-i="${i}" data-f="email" class="member my-input" required type="email" value="${member.email || ''}"/>
    <input placeholder="University ID" data-i="${i}" data-f="university_id" class="member my-input" required type="number" value="${member.university_id || ''}"/>
    <div class="buttons">
      ${i > 0 ? '<button type="button" id="backBtn" class="btn btn-join">Back</button>' : ''}
      <button type="submit" class="btn btn-hackathon">${i === teamSize - 1 ? 'Submit Team' : 'Next'}</button>
    </div>
  `
  const backBtn = document.getElementById('backBtn')
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentMember > 0) {
        currentMember--
        showMemberForm(currentMember)
      }
    })
  }
}

/* ======================UPDATE MEMBER DATA====================== */
form.addEventListener('input', (e) => {
  if (!e.target.classList.contains('member')) return

  const i = e.target.dataset.i
  const field = e.target.dataset.f

  members[i] = {
    ...members[i],
    [field]: e.target.value
  }
})
/* ======================VALIDATE SINGLE MEMBER====================== */
function validateMember(i) {
  const m = members[i]
  if (!m.full_name || m.full_name.trim() === '') return 'Full name is required'
  if (!phoneRegex.test(m.phone)) return 'Invalid phone number'
  if (!emailRegex.test(m.email)) return 'Invalid email'
  if (!idRegex.test(m.university_id)) return 'Invalid university id'
  return null
}
/* ======================SHOW SUBMIT BUTTON====================== */
function showSubmitButton() {
  form.innerHTML = `
    <h3>Team Name</h3>
    <input placeholder="Team Name" id="teamName" required type="text" value="${teamNameInput.value || ''}" class="my-input"/>
    <button id="submitTeam" class="btn btn-hackathon">Save Team</button>
  `
  document.getElementById('submitTeam').addEventListener('click', async () => {
    const teamName = document.getElementById('teamName').value
    if (!teamName) return alert('Team name is required')
    try {
      await createTeam(teamName, members)
      alert('Team saved successfully ✅')
         window.location.replace('/')
    } catch (err) {
      alert(err.message)
    }
  })
}