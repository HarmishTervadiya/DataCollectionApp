import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { ThemedText } from '../themed-text';

interface TextInputFieldProps extends Omit<TextInputProps, 'onChangeText'> {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    error?: string;
    required?: boolean;
}

const TextInputField = ({
    label,
    value,
    onValueChange,
    error,
    required = false,
    ...props
}: TextInputFieldProps) => {
    const backgroundColor = useThemeColor({}, 'background')
    const textColor = useThemeColor({}, 'text')
    const borderColor = useThemeColor({}, error ? 'error' : 'border')

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <ThemedText style={styles.label}>{label}</ThemedText>
                {required && <ThemedText style={styles.required}>*</ThemedText>}
            </View>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor,
                        color: textColor,
                        borderColor,
                    },
                ]}
                value={value}
                onChangeText={onValueChange}
                placeholderTextColor="#666"
                {...props}
            />
            {error && (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
            )}
        </View>
    )
}

export default TextInputField

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    required: {
        color: '#FF4444',
        marginLeft: 4,
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    errorText: {
        color: '#FF4444',
        fontSize: 12,
        marginTop: 4,
    },
})