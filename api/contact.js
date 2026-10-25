import { Resend } from 'resend';

// This grabs the API key from Vercel's environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, message } = req.body;

            const data = await resend.emails.send({
                from: 'Website Contact Form <onboarding@resend.dev>', // Keep this as the Resend default unless you verified Tom's domain in Resend
                to: 'tom@ythehandiesthandyman.com', // <--- TOM's EMAIL ADDRESS IS SET HERE
                subject: `New Business Inquiry from ${name}`,
                reply_to: email, // This allows Tom to just hit "Reply" in his email client
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            });

            res.status(200).json(data);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}