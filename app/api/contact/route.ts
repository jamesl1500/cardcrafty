import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const { name, email, category, subject, message } = await request.json()

        if (!name || !email || !message || !subject || !category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const { data, error } = await resend.emails.send({

            from: 'Contact Form <contact@resend.dev>',
            to: ['hello@jameslatten.com'],
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Category:</strong> ${category}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        })

        if (error) {
            return NextResponse.json(
                { error: 'Failed to send email: ' + error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}