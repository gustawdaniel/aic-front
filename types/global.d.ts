interface GoogleAuthenticatedResponse {
    clientId: string
    client_id: string
    credential: string
    select_by: "auto"
}

declare global {
    interface Window {
        googleLoginCallback: (userData: GoogleAuthenticatedResponse) => void;
        google: any
        HW_config: {
            selector: string
            account:  string
        }
    }
}

