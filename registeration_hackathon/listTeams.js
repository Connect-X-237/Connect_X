import { supabase } from './supabaseClient.js'

async function listTeams() {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*, team_members(*)')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log('=== Teams List ===')
    data.forEach(team => {
      console.log(`Team: ${team.team_name} (Members: ${team.members_count})`)
      team.team_members.forEach(member => {
        console.log(`- ${member.full_name} | ${member.email} | ${member.phone} | ID: ${member.university_id}`)
      })
    })
  } catch (err) {
    console.error('Error fetching teams:', err.message)
  }
}
listTeams()
