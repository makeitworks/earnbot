
export async function getProfile() {
    const token = localStorage.getItem("token");

    if(!token) {
        throw new Error("not signIn");
    }

    const res = await fetch(`http://localhost:4000/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    if(!res.ok) {
        throw new Error(`Unauthorized`);
    }

    return res.json();
}