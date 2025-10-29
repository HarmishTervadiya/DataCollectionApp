export interface User{
    id: string;
    name: string;
    mobileNo: number;
    address: string;
    photo: UserImage;
    createdAt: string;
}

export interface UserImage{
    url: string;
    path: string;
}

export interface UserForm{
    name: string;
    mobileNo: number;
    address: string;
    photo: { fileBody: ArrayBuffer, mimeType: string } | "" | undefined;
}

export interface UserStore{
    user: User | null;
    users: User[];
    isloading: boolean;
    error: string | null;
    success: string | null;
    
    setUser: (user: User | null) => void;
    clearError: () => void;
    clearSuccess: () => void;

    fetchUsers: () => Promise<void>;
    addUser: (data: UserForm) => Promise<boolean>;
    updateUser: (id: string, data: Partial<UserForm>) => Promise<boolean>;
    deleteUser: (id: string) => Promise<boolean>;

}