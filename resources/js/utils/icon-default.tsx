export default function IconDefault(icon: string | null) {
    return icon
        ? route('storage.local', icon)
        : 'https://cdn-icons-png.flaticon.com/512/1176/1176403.png';
}
