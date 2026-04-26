import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton } from './GradientButton';
import { AnimatedPressable } from './AnimatedPressable';
import { useTheme } from '@/theme/ThemeProvider';
import { useHaptics } from '@/hooks/useHaptics';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface AIContextValue {
  open: () => void;
  close: () => void;
  ask: (question: string) => void;
}

const AIContext = createContext<AIContextValue | null>(null);

const QUICK_PROMPTS = [
  'Summarize my last meeting',
  'Schedule a follow-up tomorrow at 10 AM',
  'Find recordings from last week',
  'Mute notifications during deep focus',
  'Recommend a meeting agenda template',
  'Translate captions in real-time',
];

const MOCK_RESPONSES = [
  'Sure! I summarized the highlights into 3 bullet points and saved them to your meeting notes.',
  'Done. I scheduled a 30-minute follow-up tomorrow at 10:00 AM IST and invited everyone from the original meeting.',
  'I found 5 recordings from last week. The longest was the Engineering all-hands at 1h 12m.',
  '“Do not disturb” is now active until 5:00 PM. I muted all chat and meeting notifications.',
  'Here\'s a clean agenda template: 1) Set the stage 2) Wins/losses 3) Decisions 4) Action items 5) Q&A.',
  'Live translation is enabled. Captions will now display in your selected language while the speaker continues in English.',
  'I created an action item and assigned it to Aditya with a due date this Friday.',
  'I rescheduled the conflicting call to Monday morning because everyone was double-booked.',
  'Of course, I drafted a reply that highlights the next steps you agreed on.',
  'You have 3 meetings tomorrow. The first one starts at 9:30 AM and is 45 minutes long.',
];

interface ProviderProps {
  children: React.ReactNode;
}

export const AIAssistantProvider: React.FC<ProviderProps> = ({ children }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const { theme } = useTheme();
  const { impact } = useHaptics();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I\'m Aria, your MeetX assistant. Ask me anything about your meetings, contacts, or recordings.',
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const open = useCallback(() => {
    impact('medium');
    sheetRef.current?.expand();
  }, [impact]);

  const close = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const ask = useCallback((question: string) => {
    if (!question.trim()) return;
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: 'user', content: question.trim() },
    ]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const reply = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)] ?? '...';
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: 'assistant', content: reply },
      ]);
      setThinking(false);
    }, 1000 + Math.random() * 800);
  }, []);

  const value = useMemo(() => ({ open, close, ask }), [open, close, ask]);

  return (
    <AIContext.Provider value={value}>
      {children}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={['85%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.colors.cardElevated, borderRadius: 32 }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border, width: 56 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.4}
          />
        )}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={theme.colors.aiGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiBadge}
            >
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Aria</Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                AI assistant for MeetX • mock responses
              </Text>
            </View>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.bubble,
                  m.role === 'user'
                    ? {
                        alignSelf: 'flex-end',
                        backgroundColor: theme.colors.brand,
                      }
                    : {
                        alignSelf: 'flex-start',
                        backgroundColor: theme.colors.surfaceMuted,
                      },
                ]}
              >
                <Text
                  style={{
                    color:
                      m.role === 'user'
                        ? theme.colors.textOnBrand
                        : theme.colors.textPrimary,
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  {m.content}
                </Text>
              </View>
            ))}
            {thinking ? (
              <View
                style={[
                  styles.bubble,
                  {
                    alignSelf: 'flex-start',
                    backgroundColor: theme.colors.surfaceMuted,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
              >
                <ActivityIndicator color={theme.colors.brand} />
                <Text style={{ marginLeft: 8, color: theme.colors.textSecondary }}>Aria is thinking…</Text>
              </View>
            ) : null}

            <View style={styles.promptRow}>
              {QUICK_PROMPTS.map((p) => (
                <AnimatedPressable
                  key={p}
                  onPress={() => ask(p)}
                  hapticStyle="light"
                  scale={0.96}
                  containerStyle={[
                    styles.promptChip,
                    {
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.promptText, { color: theme.colors.textPrimary }]}>{p}</Text>
                </AnimatedPressable>
              ))}
            </View>
          </BottomSheetScrollView>

          <View style={[styles.inputRow, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.cardElevated }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Aria anything…"
              placeholderTextColor={theme.colors.textTertiary}
              style={[
                styles.input,
                {
                  color: theme.colors.textPrimary,
                  backgroundColor: theme.colors.surfaceMuted,
                },
              ]}
              multiline
            />
            <GradientButton label="Ask" icon="send" onPress={() => ask(input)} size="sm" />
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </AIContext.Provider>
  );
};

export function useAIAssistant() {
  const ctx = useContext(AIContext);
  if (!ctx) {
    throw new Error('useAIAssistant must be used within AIAssistantProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 8,
  },
  aiBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginVertical: 6,
  },
  promptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  promptText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    fontSize: 14,
    fontWeight: '500',
  },
});
