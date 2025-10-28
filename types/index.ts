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
    photo: { fileBody: ArrayBuffer, mimeType: string } | "";
}

export interface Location{
    id: string;
    locationName: string;
}

export interface UserStore{
    user: User | null;
    users: User[];
    locations: Location[];
    isloading: boolean;
    error: string | null;
    
    setUser: (user: User | null) => void;

    fetchUsers: () => Promise<void>;
    addUser: (data: UserForm) => Promise<void>;
    updateUser: (id: string, data: Partial<UserForm>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;

    fetchLocations: () => Promise<void>;
    addLocation: (locationName: string) => Promise<void>;
    deleteLocation: (id: string) => Promise<void>;
}