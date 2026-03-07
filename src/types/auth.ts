export interface LoginPayload {
    email: string, 
    password: string
}

export interface LoginResponse {
    refresh_token: string | null
    access_token: string, 
    user: {
        id: string,
        name: string,
        email: string,
        role: string
    }
}