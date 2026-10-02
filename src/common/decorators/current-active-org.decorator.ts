import {
    createParamDecorator,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";

export const ActiveOrganizationId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const organizationId = request.session?.session?.activeOrganizationId;

        if (!organizationId) {
            throw new ForbiddenException(
                "An active organization is required for this request.",
            );
        }

        return organizationId;
    },
);