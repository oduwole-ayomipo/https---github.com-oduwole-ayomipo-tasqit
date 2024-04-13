'use client'
import axios from "axios";
import { useState } from "react";

export default function Page() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <section>
            <form>
                <input type="text" placeholder="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} /> <br />
                <input type="text" placeholder="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">Login</button>
            </form>
            <form>
                <button type="submit">Sign in</button>
            </form>

        </section>
    )

}
