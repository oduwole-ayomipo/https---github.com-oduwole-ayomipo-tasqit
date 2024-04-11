import { NextApiRequest, NextApiResponse } from "next";
import middleware from "@/app/lib/middleware";

interface AuthenticatedNextApiRequest extends NextApiRequest {
    user?: any; // Define the user property
}

export async function DELETE(req: AuthenticatedNextApiRequest, res: NextApiResponse) {
    const { id } = req.query
    try {
        middleware(
            req, res, () => {
                if (req.user.id === id) {
                    res.status(200).json({ message: "User deleted succcessfully" })
                }
            }
        )
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}