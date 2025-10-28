import { useThemeColor } from '@/hooks/use-theme-color'
import { userStore } from '@/store/user.store'
import { User, UserForm } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { Alert, Linking, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { TextInputField } from '../inputs'
import { ThemedText } from '../themed-text'
import { ThemedView } from '../themed-view'

interface UserModalProps {
    user: User | null
    visible: boolean
    onClose: () => void
}

const UserModal = ({ user, visible, onClose }: UserModalProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<UserForm>({
        name: '',
        mobileNo: 0,
        address: '',
        photo: { fileBody: new ArrayBuffer(0), mimeType: '' }
    })
    const { updateUser, deleteUser, isloading } = userStore()
    const tintColor = useThemeColor({}, 'tint')
    const errorColor = useThemeColor({}, 'error')

    // Reset form when user changes
    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                mobileNo: user.mobileNo,
                address: user.address,
                photo: { fileBody: new ArrayBuffer(0), mimeType: '' }
            })
        }
    }, [user])

    const handleSave = async () => {
        if (!user?.id) return

        try {
            await updateUser(user.id, {
                name: formData.name,
                mobileNo: parseInt(formData.mobileNo),
                address: formData.address,
                photo: formData.photo
            })
            setIsEditing(false)
        } catch (error) {
            Alert.alert('Error', 'Failed to update user')
        }
    }

    const handleDelete = async () => {
        if (!user?.id) return

        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteUser(user.id)
                            onClose()
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete user')
                        }
                    }
                }
            ]
        )
    }

    const handleCall = async () => {
        if (!user?.mobileNo) return

        const phoneNumber = `tel:${user.mobileNo}`
        const supported = await Linking.canOpenURL(phoneNumber)
        
        if (supported) {
            await Linking.openURL(phoneNumber)
        } else {
            Alert.alert('Error', 'Phone number is not supported')
        }
    }

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled) {
            const { uri } = result.assets[0]
            const response = await fetch(uri)
            const buffer = await response.arrayBuffer()

            setFormData(prev => ({
                ...prev,
                photo: {
                    fileBody: buffer,
                    mimeType: 'image/jpeg',
                }
            }))
        }
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent
        >
            <View style={styles.overlay}>
                <ThemedView style={styles.container}>
                    <View style={styles.header}>
                        <ThemedText style={styles.title}>
                            {isEditing ? 'Edit User' : 'User Details'}
                        </ThemedText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={tintColor} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {isEditing ? (
                            <>
                                <TextInputField
                                    label="Name"
                                    value={formData.name}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                                    required
                                />
                                <TextInputField
                                    label="Mobile Number"
                                    value={formData.mobileNo.toString()}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, mobileNo: parseInt(value) || 0 }))}
                                    keyboardType="phone-pad"
                                    required
                                />
                                <TextInputField
                                    label="Address"
                                    value={formData.address}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
                                    multiline
                                    numberOfLines={3}
                                    required
                                />
                                <TouchableOpacity
                                    style={styles.imageButton}
                                    onPress={pickImage}
                                >
                                    <ThemedText style={styles.imageButtonText}>
                                        {formData.photo ? 'Change Photo' : 'Add Photo'}
                                    </ThemedText>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.label}>Name:</ThemedText>
                                    <ThemedText>{user?.name}</ThemedText>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.label}>Mobile:</ThemedText>
                                    <TouchableOpacity onPress={handleCall}>
                                        <ThemedText style={styles.phoneLink}>
                                            {user?.mobileNo}
                                        </ThemedText>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.detailRow}>
                                    <ThemedText style={styles.label}>Address:</ThemedText>
                                    <ThemedText>{user?.address}</ThemedText>
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.footer}>
                        {isEditing ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={() => setIsEditing(false)}
                                    disabled={isloading}
                                >
                                    <ThemedText>Cancel</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={handleSave}
                                    disabled={isloading}
                                >
                                    <ThemedText style={styles.saveButtonText}>
                                        {isloading ? 'Saving...' : 'Save'}
                                    </ThemedText>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.editButton]}
                                    onPress={() => setIsEditing(true)}
                                >
                                    <ThemedText>Edit</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={handleDelete}
                                >
                                    <ThemedText style={styles.deleteButtonText}>
                                        Delete
                                    </ThemedText>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </ThemedView>
            </View>
        </Modal>
    )
}

export default UserModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 16,
    },
    container: {
        borderRadius: 12,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    content: {
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    label: {
        fontWeight: '500',
        marginRight: 8,
        minWidth: 60,
    },
    phoneLink: {
        color: '#0a7ea4',
        textDecorationLine: 'underline',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#E4E7EB',
    },
    deleteButton: {
        backgroundColor: '#FFE5E5',
    },
    deleteButtonText: {
        color: '#FF4444',
    },
    cancelButton: {
        backgroundColor: '#E4E7EB',
    },
    saveButton: {
        backgroundColor: '#0a7ea4',
    },
    saveButtonText: {
        color: '#FFFFFF',
    },
    imageButton: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#E4E7EB',
        alignItems: 'center',
        marginTop: 8,
    },
    imageButtonText: {
        fontWeight: '500',
    },
})