async function signUpWithPassword(name, email, password, role) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name, role: role } }
  })
  if (error) return { success: false, message: error.message }
  return { success: true, message: 'Check your email to confirm your account!' }
}

async function signInWithPassword(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { success: false, message: error.message }
  return { success: true, user: data.user }
}

async function signInWithMagicLink(email, role, name) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
     emailRedirectTo: window.location.origin + (role === 'listener' ? '/dashboard.html' : '/listeners.html'),
      data: { full_name: name || '', role: role || 'user' }
    }
  })
  if (error) return { success: false, message: error.message }
  return { success: true, message: 'Magic link sent! Check your email.' }
}

async function signOut() {
  await supabase.auth.signOut()
  window.location.href = '/index.html'
}

async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession()
  return session ? session.user : null
}

async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) window.location.href = '/signup.html'
  return user
}

async function getMyProfile() {
  const user = await getCurrentUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}
