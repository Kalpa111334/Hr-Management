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

        createMany: procedure.input($Schema.WorkShiftInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).workShift.createMany(input as any))),

        create: procedure.input($Schema.WorkShiftInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).workShift.create(input as any))),

        deleteMany: procedure.input($Schema.WorkShiftInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).workShift.deleteMany(input as any))),

        delete: procedure.input($Schema.WorkShiftInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).workShift.delete(input as any))),

        findFirst: procedure.input($Schema.WorkShiftInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).workShift.findFirst(input as any))),

        findMany: procedure.input($Schema.WorkShiftInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).workShift.findMany(input as any))),

        findUnique: procedure.input($Schema.WorkShiftInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).workShift.findUnique(input as any))),

        updateMany: procedure.input($Schema.WorkShiftInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).workShift.updateMany(input as any))),

        update: procedure.input($Schema.WorkShiftInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).workShift.update(input as any))),

        count: procedure.input($Schema.WorkShiftInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).workShift.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.WorkShiftCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.WorkShiftCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.WorkShiftCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.WorkShiftCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.WorkShiftCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.WorkShiftCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.WorkShiftGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.WorkShiftGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.WorkShiftCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.WorkShiftCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.WorkShiftGetPayload<T>, Context>) => Promise<Prisma.WorkShiftGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.WorkShiftDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.WorkShiftDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.WorkShiftDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.WorkShiftDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.WorkShiftDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.WorkShiftDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.WorkShiftGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.WorkShiftGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.WorkShiftDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.WorkShiftDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.WorkShiftGetPayload<T>, Context>) => Promise<Prisma.WorkShiftGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.WorkShiftFindFirstArgs, TData = Prisma.WorkShiftGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.WorkShiftFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.WorkShiftGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.WorkShiftFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.WorkShiftFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.WorkShiftGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.WorkShiftGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.WorkShiftFindManyArgs, TData = Array<Prisma.WorkShiftGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.WorkShiftFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.WorkShiftGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.WorkShiftFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.WorkShiftFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.WorkShiftGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.WorkShiftGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.WorkShiftFindUniqueArgs, TData = Prisma.WorkShiftGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.WorkShiftFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.WorkShiftGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.WorkShiftFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.WorkShiftFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.WorkShiftGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.WorkShiftGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.WorkShiftUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.WorkShiftUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.WorkShiftUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.WorkShiftUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.WorkShiftUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.WorkShiftUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.WorkShiftGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.WorkShiftGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.WorkShiftUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.WorkShiftUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.WorkShiftGetPayload<T>, Context>) => Promise<Prisma.WorkShiftGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.WorkShiftCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.WorkShiftCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.WorkShiftCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.WorkShiftCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.WorkShiftCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.WorkShiftCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.WorkShiftCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.WorkShiftCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
