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

        createMany: procedure.input($Schema.AttendanceInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).attendance.createMany(input as any))),

        create: procedure.input($Schema.AttendanceInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).attendance.create(input as any))),

        deleteMany: procedure.input($Schema.AttendanceInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).attendance.deleteMany(input as any))),

        delete: procedure.input($Schema.AttendanceInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).attendance.delete(input as any))),

        findFirst: procedure.input($Schema.AttendanceInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).attendance.findFirst(input as any))),

        findMany: procedure.input($Schema.AttendanceInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).attendance.findMany(input as any))),

        findUnique: procedure.input($Schema.AttendanceInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).attendance.findUnique(input as any))),

        updateMany: procedure.input($Schema.AttendanceInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).attendance.updateMany(input as any))),

        update: procedure.input($Schema.AttendanceInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).attendance.update(input as any))),

        count: procedure.input($Schema.AttendanceInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).attendance.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.AttendanceCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AttendanceCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AttendanceCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AttendanceCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.AttendanceCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AttendanceCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.AttendanceGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.AttendanceGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AttendanceCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AttendanceCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.AttendanceGetPayload<T>, Context>) => Promise<Prisma.AttendanceGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.AttendanceDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AttendanceDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AttendanceDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AttendanceDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.AttendanceDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AttendanceDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.AttendanceGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.AttendanceGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AttendanceDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AttendanceDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.AttendanceGetPayload<T>, Context>) => Promise<Prisma.AttendanceGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.AttendanceFindFirstArgs, TData = Prisma.AttendanceGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.AttendanceFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.AttendanceGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.AttendanceFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.AttendanceFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.AttendanceGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.AttendanceGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.AttendanceFindManyArgs, TData = Array<Prisma.AttendanceGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.AttendanceFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.AttendanceGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.AttendanceFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.AttendanceFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.AttendanceGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.AttendanceGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.AttendanceFindUniqueArgs, TData = Prisma.AttendanceGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.AttendanceFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.AttendanceGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.AttendanceFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.AttendanceFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.AttendanceGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.AttendanceGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.AttendanceUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AttendanceUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AttendanceUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AttendanceUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.AttendanceUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AttendanceUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.AttendanceGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.AttendanceGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AttendanceUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AttendanceUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.AttendanceGetPayload<T>, Context>) => Promise<Prisma.AttendanceGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.AttendanceCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.AttendanceCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.AttendanceCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.AttendanceCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.AttendanceCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.AttendanceCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.AttendanceCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.AttendanceCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
