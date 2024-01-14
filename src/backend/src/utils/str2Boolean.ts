export const str2Boolean = (str: string) => {
    if (!str)
        return false;
    if (str === "1" || str.toLowerCase() === "true")
        return true;
    return false;
}