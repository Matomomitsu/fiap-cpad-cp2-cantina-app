import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { LogoFiap } from '../../components/LogoFiap';
import { useUser } from '../../contexts/UserContext';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [rm, setRm] = useState('RM');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function handleRmChange(text) {
    // Sempre manter o prefixo "RM"
    if (!text.startsWith('RM')) {
      text = 'RM';
    }
    // Extrair só os dígitos depois do prefixo, limitar a 6
    const digits = text.slice(2).replace(/[^0-9]/g, '').slice(0, 6);
    setRm('RM' + digits);
  }

  function handleEntrar() {
    const digits = rm.slice(2);
    if (digits.length !== 6) {
      setErro('O RM deve conter exatamente 6 dígitos.');
      return;
    }
    if (!nome.trim()) {
      setErro('Informe seu nome para continuar.');
      return;
    }
    setErro('');
    setLoading(true);

    setTimeout(() => {
      setUser({ rm, nome: nome.trim() });
      router.push('/tabs/cardapio');
      setLoading(false);
    }, 1000);
  }

  return (
    <View style={styles.safe}>
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
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* RM */}
          <Text style={styles.label}>USUÁRIO (RM)*</Text>
          <TextInput
            style={styles.input}
            placeholder="RM000000"
            placeholderTextColor="#75838B"
            keyboardType="numeric"
            value={rm}
            onChangeText={handleRmChange}
            maxLength={8}
          />

          {/* Nome */}
          <Text style={[styles.label, { marginTop: 20 }]}>NOME COMPLETO*</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#75838B"
            autoCapitalize="words"
            value={nome}
            onChangeText={setNome}
          />

          {/* Erro */}
          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          {/* Botão */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            activeOpacity={0.8}
            onPress={handleEntrar}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    flex: 1,
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
