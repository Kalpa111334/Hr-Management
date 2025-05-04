/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from ".";
import * as _Schema from '@zenstackhq/runtime/zod/input';
const $Schema: typeof _Schema = (_Schema as any).default ?? _Schema;
import { checkRead, checkMutate } from '../helper';
import type { Prisma } from '@prisma/client';
import type { UseTRPCMutationOptions, UseTRPCMutationResult, UseTRPCQueryOptions, UseTRPCQueryResult, UseTRPCInfiniteQueryOptions, UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

export default function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({

        createMany: procedure.input($Schema.TeamMemberInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).teamMember.createMany(input as any))),

        create: procedure.input($Schema.TeamMemberInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).teamMember.create(input as any))),

        deleteMany: procedure.input($Schema.TeamMemberInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).teamMember.deleteMany(input as any))),

        delete: procedure.input($Schema.TeamMemberInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).teamMember.delete(input as any))),

        findFirst: procedure.input($Schema.TeamMemberInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).teamMember.findFirst(input as any))),

        findMany: procedure.input($Schema.TeamMemberInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).teamMember.findMany(input as any))),

        findUnique: procedure.input($Schema.TeamMemberInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).teamMember.findUnique(input as any))),

        updateMany: procedure.input($Schema.TeamMemberInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).teamMember.updateMany(input as any))),

        update: procedure.input($Schema.TeamMemberInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).teamMember.update(input as any))),

        count: procedure.input($Schema.TeamMemberInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).teamMember.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.TeamMemberCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamMemberCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamMemberCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamMemberCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.TeamMemberCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamMemberCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TeamMemberGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TeamMemberGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamMemberCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamMemberCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TeamMemberGetPayload<T>, Context>) => Promise<Prisma.TeamMemberGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.TeamMemberDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamMemberDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamMemberDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamMemberDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.TeamMemberDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamMemberDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TeamMemberGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TeamMemberGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamMemberDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamMemberDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TeamMemberGetPayload<T>, Context>) => Promise<Prisma.TeamMemberGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.TeamMemberFindFirstArgs, TData = Prisma.TeamMemberGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.TeamMemberFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TeamMemberGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TeamMemberFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TeamMemberFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TeamMemberGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TeamMemberGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.TeamMemberFindManyArgs, TData = Array<Prisma.TeamMemberGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.TeamMemberFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.TeamMemberGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TeamMemberFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TeamMemberFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.TeamMemberGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.TeamMemberGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.TeamMemberFindUniqueArgs, TData = Prisma.TeamMemberGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.TeamMemberFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TeamMemberGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TeamMemberFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.TeamMemberFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TeamMemberGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TeamMemberGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.TeamMemberUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamMemberUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamMemberUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamMemberUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.TeamMemberUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamMemberUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TeamMemberGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TeamMemberGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamMemberUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamMemberUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TeamMemberGetPayload<T>, Context>) => Promise<Prisma.TeamMemberGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.TeamMemberCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TeamMemberCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.TeamMemberCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.TeamMemberCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.TeamMemberCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.TeamMemberCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.TeamMemberCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TeamMemberCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
