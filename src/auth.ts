import { Auth, betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./database/prisma";
import { organization } from "better-auth/plugins";
import { dash } from "@better-auth/infra";



const authOptions: BetterAuthOptions = {
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),

    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    trustedOrigins: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        ...(process.env.TRUSTED_ORIGINS ? [process.env.TRUSTED_ORIGINS] : []),
    ],

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github"],
            requireLocalEmailVerified: false,
        },
    },

    advanced: {
        database: {
            joins: true, // Enable database joins for better performance
            generateId: "uuid"
        },
    },
    /* user: {
        additionalFields: {
            role: {
                type: ["MEMBER", "ADMIN"],
                required: true,
                defaultValue: "ADMIN",
                input: false,
            },
        },
    }, */

    plugins: [
        organization({
            allowUserToCreateOrganization: async (user) => {
                return user.role === "ADMIN";
            },
        }),
        dash(),
        /*  admin() */
    ],
    rateLimit: {
        enabled: true,
        storage: "memory",
        window: 60,
        max: 100,
    }
    /* socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    }, */
};

export const auth: Auth<BetterAuthOptions> = betterAuth(authOptions);