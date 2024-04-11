const jwt = require("jsonwebtoken")
import { NextApiRequest, NextApiResponse } from 'next'

interface AuthenticatedNextApiRequest extends NextApiRequest {
    user?: any; // Define the user property
}

export default async function middleware(
    req: AuthenticatedNextApiRequest,
    res: NextApiResponse,
    next: Function
) {

    console.log("testing middle ware")
    try {
        const token = req.headers.authorization?.split(' ')[1]

        // Check if the user is authenticated
        if (!token) {
            return res.status(401).json({ error: 'User is not logged in' })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)

        req.user = decodedToken

        return res.status(200).json({
            message: "Welcome user",
            user: decodedToken,
        })

        next()

        /* if (decodedToken.role !== "super admin") {
            return res.status(401).json({
                error: "Unauthorized access: User does not have admin privileges"
            })
        } */

    } catch (error) {
        return res.status(401).json({
            error: "Invalid Token",
            redirect: "/login"
        })
    }

}