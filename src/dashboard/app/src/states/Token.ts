import axios from "axios";
import { BaseUrl, jwt_cockies_name, Jwt_Refresh_Cockies_Name } from "variables/Api";
import Cookies from 'universal-cookie';

export const ResetToken = async () => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get(jwt_cockies_name);
    const refreshToken = cookies.get(Jwt_Refresh_Cockies_Name);

    try {
        if (token && refreshToken) {
            const { data }: { data: { AccessToken: string, RefreshToken: string } } = await axios.get(
                `${BaseUrl}/auth/refreshtoken`,
                Config(refreshToken)
            );
            console.log(data);
            cookies.set(jwt_cockies_name, data.AccessToken, { path: '/' });
            cookies.set(Jwt_Refresh_Cockies_Name, data.RefreshToken, { path: '/' });
        }
    } catch (error) {
        console.log(error);
    }

}
export const Config = (refreshToken: string | null = null) => {
    const cookies = new Cookies(null, { path: '/' });
    const token = cookies.get(jwt_cockies_name);

    return {
        headers: {
            Authorization: `Bearer ${refreshToken !== null ? refreshToken : token}`,
        },
    };

};

export const Wrapper = async (Function: any) => {
    try {
        await Function(Config());
    } catch (error: any) {
        console.log(error?.response?.status);
        if (error?.response?.status === 401) {
            await ResetToken();
            await Function(Config());
        } else
            throw error;
    }
}