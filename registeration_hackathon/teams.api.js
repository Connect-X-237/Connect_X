import { supabase } from './supabaseClient.js'

export async function createTeam(teamName, members) {

  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      team_name: teamName,
      members_count: members.length
    }).select().single()
  if (error) throw error
  const membersData = members.map(m => ({
    ...m,
    team_id: team.id
  }))
  const { error: membersError } = await supabase
    .from('team_members')
    .insert(membersData)

  if (membersError) throw membersError
  return team
}