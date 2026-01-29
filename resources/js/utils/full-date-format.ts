export default function fullDateFormat(date: string) {
    const newDate = new Date(date);

    const formatted = newDate.toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return formatted;
}
