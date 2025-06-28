import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: Colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
  },
});