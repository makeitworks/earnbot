
export async function signInApi(data: { email: string, password: string }) {
    const res = await fetch("http://localhost:4000/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    if(!res.ok) {
        throw new Error(`${res.statusText}`);
    } 

    return res.json();
}


export async function signUpApi(data: { name: string, email: string, password: string}) {
    const res = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if(!res.ok) {
        throw new Error("注册失败");
    }

    return res.json();
}