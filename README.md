# Boilerplate Web Application

A modern web application boilerplate built with Next.js, featuring authentication, email verification, and user management.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- [Resend](https://resend.com) account for email services

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
```

### Configuration Steps

1. **MongoDB Setup**

   - Create a MongoDB database
   - Replace `your_mongodb_connection_string` with your actual MongoDB connection string
   - Update database name in `scripts/seed.js` and `src/lib/mongodb.ts`

2. **NextAuth Setup**

   - Generate a secure random string for `NEXTAUTH_SECRET`
   - Set `NEXTAUTH_URL` to your application's URL (use `http://localhost:3000` for local development)

3. **Email Service Setup**

   - Sign up for a [Resend](https://resend.com) account
   - Get your API key from the Resend dashboard
   - Replace `your_resend_api_key` with your actual Resend API key
   - Set `FROM_EMAIL` to your verified email address in Resend
   - Update `FROM_EMAIL` in `src/app/api/auth/send-verification/route.ts`

4. **Project Customization**
   - Update project name in `package.json`
   - Update project name in `package-lock.json`
   - Update site title and metadata in `src/app/layout.tsx`
   - Update any branding references in email templates

### Important Files to Update

```plaintext
├── package.json                                    # Update project name and version
├── package-lock.json                              # Update project name
├── src/
│   ├── app/
│   │   ├── layout.tsx                            # Update site title and metadata
│   │   └── api/auth/send-verification/route.ts   # Update FROM_EMAIL
│   └── lib/
│       └── mongodb.ts                            # Update database name if needed
└── scripts/
    └── seed.js                                   # Update database name if needed
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/boilerplate.git
cd boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- User authentication (sign up, sign in, sign out)
- Email verification
- Account settings management
  - Update profile information
  - Change email address (with verification)
  - Change password
- Responsive design
- Modern UI with DaisyUI components

## Important Notes

- Make sure to replace all placeholder API keys and credentials before deploying
- The email verification codes expire after 10 minutes
- Keep your environment variables secure and never commit them to version control
- Update the `FROM_EMAIL` in `src/app/api/auth/send-verification/route.ts` to match your verified email address

## Security Considerations

- All API keys and secrets should be kept private
- Use strong, unique passwords for all services
- Regularly update dependencies for security patches
- Monitor your email service usage and API key access

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
