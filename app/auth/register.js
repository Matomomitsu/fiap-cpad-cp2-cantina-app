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
import { registerUser } from '../../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  function validar() {
    if (!nome.trim()) {
      return 'Informe seu nome completo.';
    }
    if (!email.trim()) {
      return 'Informe seu e-mail.';
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return 'E-mail com formato inválido.';
    }
    if (senha.length < 6) {
      return 'A senha deve ter no mínimo 6 caracteres.';
    }
    if (senha !== confirmaSenha) {
      return 'As senhas não coincidem.';
    }
    return null;
  }

  async function handleCadastrar() {
    const erroValidacao = validar();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setErro('');
    setLoading(true);

    try {
      const result = await registerUser({ nome, email, senha });

      if (!result.success) {
        setErro(result.error);
        setLoading(false);
        return;
      }

      setSucesso(true);

      // Redireciona para login após 1.5s
      setTimeout(() => {
        router.replace('/auth/login');
      }, 1500);
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
            <Text style={styles.headingAccent}>CRIAR CONTA</Text>
            <Text style={styles.headingSub}>Preencha os dados abaixo</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {sucesso ? (
              <View style={styles.sucessoWrap}>
                <Text style={styles.sucessoIcon}>✓</Text>
                <Text style={styles.sucessoText}>
                  Conta criada com sucesso!
                </Text>
                <Text style={styles.sucessoSub}>
                  Redirecionando para o login...
                </Text>
              </View>
            ) : (
              <>
                {/* Nome */}
                <Text style={styles.label}>NOME COMPLETO *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#75838B"
                  autoCapitalize="words"
                  value={nome}
                  onChangeText={(t) => { setNome(t); setErro(''); }}
                />

                {/* Email */}
                <Text style={[styles.label, { marginTop: 20 }]}>E-MAIL *</Text>
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
                <Text style={[styles.label, { marginTop: 20 }]}>SENHA * (mín. 6 caracteres)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Crie uma senha"
                  placeholderTextColor="#75838B"
                  secureTextEntry
                  value={senha}
                  onChangeText={(t) => { setSenha(t); setErro(''); }}
                />

                {/* Confirmação */}
                <Text style={[styles.label, { marginTop: 20 }]}>CONFIRMAR SENHA *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  placeholderTextColor="#75838B"
                  secureTextEntry
                  value={confirmaSenha}
                  onChangeText={(t) => { setConfirmaSenha(t); setErro(''); }}
                />

                {/* Erro */}
                {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

                {/* Botão Cadastrar */}
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  activeOpacity={0.8}
                  onPress={handleCadastrar}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>CADASTRAR</Text>
                  )}
                </TouchableOpacity>

                {/* Link para Login */}
                <TouchableOpacity
                  style={styles.linkWrap}
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                >
                  <Text style={styles.linkText}>
                    Já tem conta?{' '}
                    <Text style={styles.linkAccent}>Fazer login</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 40,
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
  sucessoWrap: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  sucessoIcon: {
    color: '#4CAF50',
    fontSize: 48,
    marginBottom: 16,
  },
  sucessoText: {
    color: '#F4F4F8',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sucessoSub: {
    color: '#75838B',
    fontSize: 13,
  },
});
