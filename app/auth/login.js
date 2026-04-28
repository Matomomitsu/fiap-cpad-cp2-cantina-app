import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { LogoFiap } from '../../components/LogoFiap';
import { useUser } from '../../contexts/UserContext';
import { loginUser } from '../../services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEntrar() {
    // Validações locais
    if (!email.trim()) {
      setErro('Informe seu e-mail.');
      return;
    }
    if (!senha) {
      setErro('Informe sua senha.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      const result = await loginUser({ email, senha });

      if (!result.success) {
        setErro(result.error);
        setLoading(false);
        return;
      }

      setUser(result.user);
      router.replace('/tabs/cardapio');
    } catch {
      setErro('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <LogoFiap width={130} height={35} />
          </View>

          {/* Heading */}
          <View style={styles.headingWrap}>
            <Text style={styles.headingAccent}>CANTINA</Text>
            <Text style={styles.headingSub}>Faça login para continuar</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Email */}
            <Text style={styles.label}>E-MAIL *</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#75838B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(t) => { setEmail(t); setErro(''); }}
            />

            {/* Senha */}
            <Text style={[styles.label, { marginTop: 20 }]}>SENHA *</Text>
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#75838B"
              secureTextEntry
              value={senha}
              onChangeText={(t) => { setSenha(t); setErro(''); }}
            />

            {/* Erro */}
            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              onPress={handleEntrar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            {/* Link para Cadastro */}
            <TouchableOpacity
              style={styles.linkWrap}
              activeOpacity={0.7}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.linkText}>
                Não tem conta?{' '}
                <Text style={styles.linkAccent}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Rodapé */}
      <Text style={styles.footer}>PEÇA SEM FILA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headingWrap: {
    alignItems: 'center',
    marginBottom: 36,
  },
  headingAccent: {
    color: '#ED145B',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headingSub: {
    color: '#75838B',
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#111416',
    borderRadius: 2,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  label: {
    color: '#B7B7B7',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 0.7,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: '#ACC1CC',
    fontSize: 15,
    paddingHorizontal: 12,
  },
  erro: {
    color: '#ED145B',
    fontSize: 12,
    marginTop: 12,
  },
  button: {
    backgroundColor: '#ED145B',
    height: 52,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#75838B',
    fontSize: 13,
  },
  linkAccent: {
    color: '#ED145B',
    fontWeight: '600',
  },
  footer: {
    color: '#75838B',
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 1,
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
  },
});
