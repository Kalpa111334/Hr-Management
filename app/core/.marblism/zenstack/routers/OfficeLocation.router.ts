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

        createMany: procedure.input($Schema.OfficeLocationInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).officeLocation.createMany(input as any))),

        create: procedure.input($Schema.OfficeLocationInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).officeLocation.create(input as any))),

        deleteMany: procedure.input($Schema.OfficeLocationInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).officeLocation.deleteMany(input as any))),

        delete: procedure.input($Schema.OfficeLocationInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).officeLocation.delete(input as any))),

        findFirst: procedure.input($Schema.OfficeLocationInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).officeLocation.findFirst(input as any))),

        findMany: procedure.input($Schema.OfficeLocationInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).officeLocation.findMany(input as any))),

        findUnique: procedure.input($Schema.OfficeLocationInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).officeLocation.findUnique(input as any))),

        updateMany: procedure.input($Schema.OfficeLocationInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).officeLocation.updateMany(input as any))),

        update: procedure.input($Schema.OfficeLocationInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).officeLocation.update(input as any))),

        count: procedure.input($Schema.OfficeLocationInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).officeLocation.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.OfficeLocationCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OfficeLocationCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OfficeLocationCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OfficeLocationCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.OfficeLocationCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OfficeLocationCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OfficeLocationGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OfficeLocationGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OfficeLocationCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OfficeLocationCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OfficeLocationGetPayload<T>, Context>) => Promise<Prisma.OfficeLocationGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.OfficeLocationDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OfficeLocationDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OfficeLocationDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OfficeLocationDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.OfficeLocationDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OfficeLocationDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OfficeLocationGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OfficeLocationGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OfficeLocationDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OfficeLocationDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OfficeLocationGetPayload<T>, Context>) => Promise<Prisma.OfficeLocationGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.OfficeLocationFindFirstArgs, TData = Prisma.OfficeLocationGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.OfficeLocationFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.OfficeLocationGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OfficeLocationFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.OfficeLocationFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.OfficeLocationGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.OfficeLocationGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.OfficeLocationFindManyArgs, TData = Array<Prisma.OfficeLocationGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.OfficeLocationFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.OfficeLocationGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OfficeLocationFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.OfficeLocationFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.OfficeLocationGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.OfficeLocationGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.OfficeLocationFindUniqueArgs, TData = Prisma.OfficeLocationGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.OfficeLocationFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.OfficeLocationGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.OfficeLocationFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.OfficeLocationFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.OfficeLocationGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.OfficeLocationGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.OfficeLocationUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OfficeLocationUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OfficeLocationUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OfficeLocationUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.OfficeLocationUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.OfficeLocationUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.OfficeLocationGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.OfficeLocationGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.OfficeLocationUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.OfficeLocationUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.OfficeLocationGetPayload<T>, Context>) => Promise<Prisma.OfficeLocationGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.OfficeLocationCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.OfficeLocationCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.OfficeLocationCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.OfficeLocationCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.OfficeLocationCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.OfficeLocationCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.OfficeLocationCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.OfficeLocationCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
