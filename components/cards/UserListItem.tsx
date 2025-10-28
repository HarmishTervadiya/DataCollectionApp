import { useThemeColor } from '@/hooks/use-theme-color'
import { User } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'

interface UserListItemProps {
    user: User
    onPress?: () => void
}

const UserListItem = ({ user, onPress }: UserListItemProps) => {
    const iconColor = useThemeColor({}, 'icon')
    const tintColor = useThemeColor({}, 'tint')

    const handleCall = async () => {
        const phoneNumber = `tel:${user.mobileNo}`
        const supported = await Linking.canOpenURL(phoneNumber)
        
        if (supported) {
            await Linking.openURL(phoneNumber)
        } else {
            console.error('Phone number is not supported')
        }
    }

    return (
        <TouchableOpacity onPress={onPress}>
            <ThemedView style={styles.container}>
                <View style={styles.leftContent}>
                    {user.photo?.url ? (
                        <Image
                            source={{ uri: user.photo.url }}
                            style={styles.avatar}
                            contentFit="cover"
                            transition={200}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.placeholderAvatar]}>
                            <ThemedText style={styles.avatarText}>
                                {user.name.charAt(0).toUpperCase()}
                            </ThemedText>
                        </View>
                    )}
                    <View style={styles.info}>
                        <ThemedText style={styles.name}>{user.name}</ThemedText>
                        <ThemedText style={styles.phone}>{user.mobileNo}</ThemedText>
                        <ThemedText style={styles.address} numberOfLines={1}>
                            {user.address}
                        </ThemedText>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={handleCall}
                >
                    <Ionicons name="call-outline" size={24} color={tintColor} />
                </TouchableOpacity>
            </ThemedView>
        </TouchableOpacity>
    )
}

export default UserListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E4E7EB',
        justifyContent: 'space-between',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    placeholderAvatar: {
        backgroundColor: '#E4E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
    },
    info: {
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    phone: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 2,
    },
    address: {
        fontSize: 12,
        opacity: 0.6,
    },
    callButton: {
        padding: 8,
    },
})
