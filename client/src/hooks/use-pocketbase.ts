import { RecordService } from 'pocketbase';

import type {
    CollectionResponses,
    RecordIdString
} from '@/types/pocketbase';
import { useCallback, useMemo, useState } from 'react';
import { pb } from '@/lib/pocketbase';

type TCollectionName = keyof CollectionResponses;

type TResponse<C extends TCollectionName> = CollectionResponses[C];
type TPayload = Record<string, unknown>;

type PbOptions = {
    $autoCancel?: boolean;
    expand?: string;
    sort?: string;
    filter?: string;
};

interface PocketbaseHookResult<C extends TCollectionName> {
    isLoading: boolean;
    error: Error | null;

    getRecords: (options?: PbOptions) => Promise<TResponse<C>[]>;
    getOneRecord: (id: RecordIdString, options?: PbOptions) => Promise<TResponse<C>>;
    createRecord: (data: TPayload, options?: PbOptions) => Promise<TResponse<C>>;
    updateRecord: (id: RecordIdString, data: TPayload, options?: PbOptions) => Promise<TResponse<C>>;
    deleteRecord: (id: RecordIdString, options?: PbOptions) => Promise<boolean>;

    collectionService: RecordService<TResponse<C>>;
}


/**
 * Custom Hook for CRUD operations with PocketBase using types from pocketbase-typegen.
 * @param {C} collectionName - The name of the collection (table), must be a key of 'Collections'.
 * @returns {PocketbaseHookResult<C>} An object containing CRUD functions and related state.
 */
function usePocketbase<C extends TCollectionName>(
    collectionName: C
): PocketbaseHookResult<C> {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const collection = useMemo(() => {
        return pb.collection(collectionName);
    }, [collectionName]) as RecordService<TResponse<C>>;

    const execute = useCallback(async <R>(asyncFunction: () => Promise<R>): Promise<R> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await asyncFunction();
            setIsLoading(false);
            return result;
        } catch (err) {
            const typedError = err instanceof Error ? err : new Error("An unknown error occurred");
            console.error(`PocketBase Error for ${collectionName}:`, typedError);
            setError(typedError);
            setIsLoading(false);
            throw typedError;
        }
    }, [collectionName]);


    const getRecords = useCallback(async (options: PbOptions = {}): Promise<TResponse<C>[]> => {
        return execute(async () => {
            return collection.getFullList(options);
        });
    }, [collection, execute]);

    const getOneRecord = useCallback(async (id: RecordIdString, options: PbOptions = {}): Promise<TResponse<C>> => {
        return execute(async () => {
            return collection.getOne(id, options);
        });
    }, [collection, execute]);

    const createRecord = useCallback(async (data: TPayload, options: PbOptions = {}): Promise<TResponse<C>> => {
        return execute(async () => {
            return collection.create(data, options);
        });
    }, [collection, execute]);

    const updateRecord = useCallback(async (id: RecordIdString, data: TPayload, options: PbOptions = {}): Promise<TResponse<C>> => {
        return execute(async () => {
            return collection.update(id, data, options);
        });
    }, [collection, execute]);

    const deleteRecord = useCallback(async (id: RecordIdString, options: PbOptions = {}): Promise<boolean> => {
        return execute(async () => {
            await collection.delete(id, options);
            return true;
        });
    }, [collection, execute]);


    return {
        isLoading,
        error,
        getRecords,
        getOneRecord,
        createRecord,
        updateRecord,
        deleteRecord,
        collectionService: collection,
    };
}

export default usePocketbase;