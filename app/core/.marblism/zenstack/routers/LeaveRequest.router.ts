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

        createMany: procedure.input($Schema.LeaveRequestInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).leaveRequest.createMany(input as any))),

        create: procedure.input($Schema.LeaveRequestInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).leaveRequest.create(input as any))),

        deleteMany: procedure.input($Schema.LeaveRequestInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).leaveRequest.deleteMany(input as any))),

        delete: procedure.input($Schema.LeaveRequestInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).leaveRequest.delete(input as any))),

        findFirst: procedure.input($Schema.LeaveRequestInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).leaveRequest.findFirst(input as any))),

        findMany: procedure.input($Schema.LeaveRequestInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).leaveRequest.findMany(input as any))),

        findUnique: procedure.input($Schema.LeaveRequestInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).leaveRequest.findUnique(input as any))),

        updateMany: procedure.input($Schema.LeaveRequestInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).leaveRequest.updateMany(input as any))),

        update: procedure.input($Schema.LeaveRequestInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).leaveRequest.update(input as any))),

        count: procedure.input($Schema.LeaveRequestInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).leaveRequest.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.LeaveRequestCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.LeaveRequestCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.LeaveRequestCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.LeaveRequestCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.LeaveRequestCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.LeaveRequestCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.LeaveRequestGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.LeaveRequestGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.LeaveRequestCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.LeaveRequestCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.LeaveRequestGetPayload<T>, Context>) => Promise<Prisma.LeaveRequestGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.LeaveRequestDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.LeaveRequestDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.LeaveRequestDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.LeaveRequestDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.LeaveRequestDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.LeaveRequestDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.LeaveRequestGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.LeaveRequestGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.LeaveRequestDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.LeaveRequestDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.LeaveRequestGetPayload<T>, Context>) => Promise<Prisma.LeaveRequestGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.LeaveRequestFindFirstArgs, TData = Prisma.LeaveRequestGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.LeaveRequestFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.LeaveRequestGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.LeaveRequestFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.LeaveRequestFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.LeaveRequestGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.LeaveRequestGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.LeaveRequestFindManyArgs, TData = Array<Prisma.LeaveRequestGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.LeaveRequestFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.LeaveRequestGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.LeaveRequestFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.LeaveRequestFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.LeaveRequestGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.LeaveRequestGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.LeaveRequestFindUniqueArgs, TData = Prisma.LeaveRequestGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.LeaveRequestFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.LeaveRequestGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.LeaveRequestFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.LeaveRequestFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.LeaveRequestGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.LeaveRequestGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.LeaveRequestUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.LeaveRequestUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.LeaveRequestUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.LeaveRequestUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.LeaveRequestUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.LeaveRequestUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.LeaveRequestGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.LeaveRequestGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.LeaveRequestUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.LeaveRequestUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.LeaveRequestGetPayload<T>, Context>) => Promise<Prisma.LeaveRequestGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.LeaveRequestCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.LeaveRequestCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.LeaveRequestCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.LeaveRequestCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.LeaveRequestCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.LeaveRequestCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.LeaveRequestCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.LeaveRequestCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
