const development: boolean = true;

export const BaseUrl = `${development ? 'http://127.0.0.1:8080' : 'https://api.ipshort.com'}/api/v1`;
export const jwt_cockies_name = "jwt_token";
export const Jwt_Refresh_Cockies_Name = "jwt_refresh";