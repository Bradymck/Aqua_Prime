import { supabase } from './db'

export async function createUser(ethAddress: string, username: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({ eth_address: ethAddress, username })
    .single()

  if (error) throw error
  return data
}

export async function getUser(ethAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('eth_address', ethAddress)
    .single()

  if (error) throw error
  return data
}

export async function createGameSession(hostUserId: string) {
  const { data, error } = await supabase
    .from('game_sessions')
    .insert({ host_user_id: hostUserId })
    .single()

  if (error) throw error
  return data
}

export async function addSessionParticipant(gameSessionId: string, userId: string, role: 'host' | 'player' | 'ai_bot') {
  const { data, error } = await supabase
    .from('session_participants')
    .insert({ game_session_id: gameSessionId, user_id: userId, role })
    .single()

  if (error) throw error
  return data
}

export async function getNFTsByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .eq('owner_id', ownerId)

  if (error) throw error
  return data
}

export async function updateNFTPlaytime(nftId: string, playtime: number) {
  const { data, error } = await supabase
    .from('nfts')
    .update({ 
      total_playtime: supabase.rpc('increment', { inc: playtime }),
      last_played_at: new Date().toISOString()
    })
    .eq('id', nftId)
    .single()

  if (error) throw error
  return data
}