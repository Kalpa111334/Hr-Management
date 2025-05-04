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

        createMany: procedure.input($Schema.TeamInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).team.createMany(input as any))),

        create: procedure.input($Schema.TeamInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).team.create(input as any))),

        deleteMany: procedure.input($Schema.TeamInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).team.deleteMany(input as any))),

        delete: procedure.input($Schema.TeamInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).team.delete(input as any))),

        findFirst: procedure.input($Schema.TeamInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).team.findFirst(input as any))),

        findMany: procedure.input($Schema.TeamInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).team.findMany(input as any))),

        findUnique: procedure.input($Schema.TeamInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).team.findUnique(input as any))),

        updateMany: procedure.input($Schema.TeamInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).team.updateMany(input as any))),

        update: procedure.input($Schema.TeamInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).team.update(input as any))),

        count: procedure.input($Schema.TeamInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).team.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.TeamCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.TeamCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TeamGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TeamGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TeamGetPayload<T>, Context>) => Promise<Prisma.TeamGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.TeamDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.TeamDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TeamGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TeamGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TeamGetPayload<T>, Context>) => Promise<Prisma.TeamGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.TeamFindFirstArgs, TData = Prisma.TeamGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.TeamFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TeamGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TeamFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TeamFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TeamGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TeamGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.TeamFindManyArgs, TData = Array<Prisma.TeamGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.TeamFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.TeamGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TeamFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.TeamFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.TeamGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.TeamGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.TeamFindUniqueArgs, TData = Prisma.TeamGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.TeamFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.TeamGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.TeamFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.TeamFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.TeamGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.TeamGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.TeamUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.TeamUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.TeamUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.TeamGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.TeamGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.TeamUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.TeamUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.TeamGetPayload<T>, Context>) => Promise<Prisma.TeamGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.TeamCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TeamCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.TeamCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.TeamCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.TeamCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.TeamCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.TeamCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.TeamCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
