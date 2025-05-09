/* eslint-disable */
import type { unsetMarker, AnyRouter, AnyRootConfig, CreateRouterInner, Procedure, ProcedureBuilder, ProcedureParams, ProcedureRouterRecord, ProcedureType } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import createUserRouter from "./User.router";
import createWorkShiftRouter from "./WorkShift.router";
import createOfficeLocationRouter from "./OfficeLocation.router";
import createTeamRouter from "./Team.router";
import createTeamMemberRouter from "./TeamMember.router";
import createAttendanceRouter from "./Attendance.router";
import createLeaveRequestRouter from "./LeaveRequest.router";
import { ClientType as UserClientType } from "./User.router";
import { ClientType as WorkShiftClientType } from "./WorkShift.router";
import { ClientType as OfficeLocationClientType } from "./OfficeLocation.router";
import { ClientType as TeamClientType } from "./Team.router";
import { ClientType as TeamMemberClientType } from "./TeamMember.router";
import { ClientType as AttendanceClientType } from "./Attendance.router";
import { ClientType as LeaveRequestClientType } from "./LeaveRequest.router";

export type BaseConfig = AnyRootConfig;

export type RouterFactory<Config extends BaseConfig> = <
    ProcRouterRecord extends ProcedureRouterRecord
>(
    procedures: ProcRouterRecord
) => CreateRouterInner<Config, ProcRouterRecord>;

export type UnsetMarker = typeof unsetMarker;

export type ProcBuilder<Config extends BaseConfig> = ProcedureBuilder<
    ProcedureParams<Config, any, any, any, UnsetMarker, UnsetMarker, any>
>;

export function db(ctx: any) {
    if (!ctx.prisma) {
        throw new Error('Missing "prisma" field in trpc context');
    }
    return ctx.prisma as PrismaClient;
}

export function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({
        user: createUserRouter(router, procedure),
        workShift: createWorkShiftRouter(router, procedure),
        officeLocation: createOfficeLocationRouter(router, procedure),
        team: createTeamRouter(router, procedure),
        teamMember: createTeamMemberRouter(router, procedure),
        attendance: createAttendanceRouter(router, procedure),
        leaveRequest: createLeaveRequestRouter(router, procedure),
    }
    );
}

export interface ClientType<AppRouter extends AnyRouter> {
    user: UserClientType<AppRouter>;
    workShift: WorkShiftClientType<AppRouter>;
    officeLocation: OfficeLocationClientType<AppRouter>;
    team: TeamClientType<AppRouter>;
    teamMember: TeamMemberClientType<AppRouter>;
    attendance: AttendanceClientType<AppRouter>;
    leaveRequest: LeaveRequestClientType<AppRouter>;
}
