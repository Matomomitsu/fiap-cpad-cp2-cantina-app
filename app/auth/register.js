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

  const [erros, setErros] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: '',
  });

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  function validar() {
    const novosErros = {
      nome: '',
      email: '',
      senha: '',
      confirmaSenha: '',
    };

    let valido = true;

    if (!nome.trim()) {
      novosErros.nome = 'Informe seu nome completo.';
      valido = false;
    }

    if (!email.trim()) {
      novosErros.email = 'Informe seu e-mail.';
      valido = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      novosErros.email = 'E-mail inválido.';
      valido = false;
    }

    if (!senha.trim()) {
      novosErros.senha = 'Informe sua senha.';
      valido = false;
    } else if (senha.length < 6) {
      novosErros.senha = 'Mínimo 6 caracteres.';
      valido = false;
    }

    if (!confirmaSenha.trim()) {
      novosErros.confirmaSenha = 'Confirme sua senha.';
      valido = false;
    } else if (senha !== confirmaSenha) {
      novosErros.confirmaSenha = 'As senhas não coincidem.';
      valido = false;
    }

    setErros(novosErros);
    return valido;
  }

  async function handleCadastrar() {
    if (!validar()) return;

    setLoading(true);

    try {
      const result = await registerUser({
        nome,
        email,
        senha,
      });

      if (!result.success) {
        setErros((prev) => ({
          ...prev,
          email: result.error,
        }));
        setLoading(false);
        return;
      }

      setSucesso(true);

      setTimeout(() => {
        router.replace('/auth/login');
      }, 1500);
    } catch {
      setErros((prev) => ({
        ...prev,
        email: 'Erro ao cadastrar.',
      }));
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
          <View style={styles.logoWrap}>
            <LogoFiap width={130} height={35} />
          </View>

          <View style={styles.headingWrap}>
            <Text style={styles.headingAccent}>CRIAR CONTA</Text>
            <Text style={styles.headingSub}>
              Preencha os dados abaixo
            </Text>
          </View>

          <View style={styles.card}>
            {sucesso ? (
              <View style={styles.sucessoWrap}>
                <Text style={styles.sucessoIcon}>✓</Text>
                <Text style={styles.sucessoText}>
                  Conta criada com sucesso!
                </Text>
                <Text style={styles.sucessoSub}>
                  Redirecionando...
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.label}>NOME COMPLETO *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  placeholderTextColor="#75838B"
                  value={nome}
                  onChangeText={(t) => {
                    setNome(t);
                    setErros({ ...erros, nome: '' });
                  }}
                />
                {erros.nome !== '' && (
                  <Text style={styles.erro}>{erros.nome}</Text>
                )}

                <Text style={[styles.label, { marginTop: 20 }]}>
                  E-MAIL *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#75838B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    setErros({ ...erros, email: '' });
                  }}
                />
                {erros.email !== '' && (
                  <Text style={styles.erro}>{erros.email}</Text>
                )}

                <Text style={[styles.label, { marginTop: 20 }]}>
                  SENHA *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#75838B"
                  secureTextEntry
                  value={senha}
                  onChangeText={(t) => {
                    setSenha(t);
                    setErros({ ...erros, senha: '' });
                  }}
                />
                {erros.senha !== '' && (
                  <Text style={styles.erro}>{erros.senha}</Text>
                )}

                <Text style={[styles.label, { marginTop: 20 }]}>
                  CONFIRMAR SENHA *
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  placeholderTextColor="#75838B"
                  secureTextEntry
                  value={confirmaSenha}
                  onChangeText={(t) => {
                    setConfirmaSenha(t);
                    setErros({
                      ...erros,
                      confirmaSenha: '',
                    });
                  }}
                />
                {erros.confirmaSenha !== '' && (
                  <Text style={styles.erro}>
                    {erros.confirmaSenha}
                  </Text>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleCadastrar}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>
                      CADASTRAR
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkWrap}
                  onPress={() => router.back()}
                >
                  <Text style={styles.linkText}>
                    Já tem conta?{' '}
                    <Text style={styles.linkAccent}>
                      Fazer login
                    </Text>
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
    backgroundColor: '#000',
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
  },
  headingSub: {
    color: '#75838B',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#111416',
    padding: 24,
  },
  label: {
    color: '#B7B7B7',
    fontSize: 11,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#333',
    color: '#FFF',
    paddingHorizontal: 12,
  },
  erro: {
    color: '#ED145B',
    fontSize: 12,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#ED145B',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#75838B',
  },
  linkAccent: {
    color: '#ED145B',
  },
  sucessoWrap: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  sucessoIcon: {
    color: '#4CAF50',
    fontSize: 48,
  },
  sucessoText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 12,
  },
  sucessoSub: {
    color: '#75838B',
    marginTop: 8,
  },
});
