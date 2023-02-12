import type { NextApiRequest, NextApiResponse } from 'next';
import { emailsDB, keysDB } from "@/pages/api/index";
import { emailValidation } from "@/pages/api/validators";

type Data = {
    subscribed: boolean,
    error?: string,
    accessToDashboard?: boolean,
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { email } = JSON.parse(req.body);
    const validateForEmail = emailValidation(email);
    if(validateForEmail) { //check whether it is an email
        const checkEmptyEmail = emailsDB.get(email);
        if(!checkEmptyEmail) { // check if email wasn't already added
            emailsDB.add(email, true);
            res
                .status(200)
                .json({ subscribed: true });
        } else { // otherwise say that already has this email, no action required
            res
                .status(204)
                .end();
        }
    } else { // this is not email, maybe a promo code?
        const checkForPromo = keysDB.get(email);
        if(checkForPromo) {
            res
                .status(200)
                .json({ subscribed: false, accessToDashboard: true });
        } else {
            res.status(400).json({subscribed: false, error: 'Invalid Email'});
        }
    }
}
