export const ParseDate = (date: Date | null): string => {
    if (date == null) return "--/--/--";
    if (typeof date === "string") date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[month];

    const formattedDate = `${day}/${monthName}/${year}`;
    return formattedDate;
}

