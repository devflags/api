import { Auth, betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./database/prisma";
import { admin, organization } from "better-auth/plugins";


const authOptions: BetterAuthOptions = {
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),

    emailAndPassword: {
        enabled: true,
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