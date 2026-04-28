import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@cantina-fiap/users';
const SESSION_KEY = '@cantina-fiap/session';

/**
 * Retorna a lista de usuários cadastrados.
 */
async function getUsers() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva a lista de usuários no AsyncStorage.
 */
async function saveUsers(users) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Cadastra um novo usuário.
 * Retorna { success, user?, error? }
 */
export async function registerUser({ nome, email, senha }) {
  const users = await getUsers();
  const emailNorm = email.trim().toLowerCase();

  const exists = users.find((u) => u.email === emailNorm);
  if (exists) {
    return { success: false, error: 'Este e-mail já está cadastrado.' };
  }

  const newUser = {
    id: Date.now().toString(),
    nome: nome.trim(),
    email: emailNorm,
    senha, // em produção seria hash — aqui é mock local
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  return { success: true, user: { id: newUser.id, nome: newUser.nome, email: newUser.email } };
}

/**
 * Autentica um usuário com email + senha.
 * Retorna { success, user?, error? }
 */
export async function loginUser({ email, senha }) {
  const users = await getUsers();
  const emailNorm = email.trim().toLowerCase();

  const found = users.find((u) => u.email === emailNorm && u.senha === senha);

  if (!found) {
    return { success: false, error: 'E-mail ou senha inválidos.' };
  }

  const sessionUser = { id: found.id, nome: found.nome, email: found.email };

  // Persiste a sessão
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  return { success: true, user: sessionUser };
}

/**
 * Recupera a sessão ativa (auto-login).
 * Retorna o user ou null.
 */
export async function getSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Limpa a sessão (logout).
 */
export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
