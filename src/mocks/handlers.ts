import { http, HttpResponse } from 'msw';
import { DraftExperiment, Experiment } from '../api-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const indexedDBName = 'experimentsDB';
const indexedDBVersion = 1;
let db: IDBDatabase | null = null;
// Open or upgrade IndexedDB properly
const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(indexedDBName, indexedDBVersion);

    request.onupgradeneeded = () => {
      const upgradeDB = request.result;
      if (!upgradeDB.objectStoreNames.contains('experiments')) {
        upgradeDB.createObjectStore('experiments', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
      if (!upgradeDB.objectStoreNames.contains('draft-experiments')) {
        upgradeDB.createObjectStore('draft-experiments', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject(request.error);
    };
  });
};

// Utility to get object store safely
const getObjectStore = async (storeName: string, mode: IDBTransactionMode) => {
  const database = await openDB();
  const transaction = database.transaction(storeName, mode);
  return transaction.objectStore(storeName);
};

// Utility to wait for IndexedDB request completion
const getRequestResult = <T>(request: IDBRequest<T>): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () =>
      reject(request.error || new Error('IndexedDB request failed'));
  });
};

export const handlers = [
  // GET /draft-experiments
  http.get(`${API_BASE_URL}/draft-experiments`, async ({ request }) => {
    try {
      const url = new URL(request.url);
      const draftExperimentId = url.searchParams.get('id');
      const objectStore = await getObjectStore('draft-experiments', 'readonly');

      if (draftExperimentId) {
        const getRequest = objectStore.get(Number(draftExperimentId));
        const existingData = await getRequestResult(getRequest);
        if (!existingData) {
          return HttpResponse.json(
            {
              error: 'Draft experiment not found',
              status: 404,
            },
            { status: 404 }
          );
        }
        return HttpResponse.json(existingData, { status: 200 });
      } else {
        const response = await getRequestResult(objectStore.getAll());
        return HttpResponse.json(response, { status: 200 });
      }
    } catch (error) {
      console.error(error);
      return HttpResponse.json(
        { error: 'Error retrieving draft experiments', status: 500 },
        { status: 500 }
      );
    }
  }),

  // GET /experiments
  http.get(`${API_BASE_URL}/experiments`, async ({ request }) => {
    try {
      const url = new URL(request.url);
      const experimentId = url.searchParams.get('id');
      const objectStore = await getObjectStore('experiments', 'readonly');

      if (experimentId) {
        const getRequest = objectStore.get(Number(experimentId));
        const existingData = await getRequestResult(getRequest);
        if (!existingData) {
          return HttpResponse.json(
            {
              error: 'Experiment not found',
              status: 404,
            },
            { status: 404 }
          );
        }
        return HttpResponse.json(existingData, { status: 200 });
      } else {
        const response = await getRequestResult(objectStore.getAll());
        return HttpResponse.json(response, { status: 200 });
      }
    } catch (error) {
      console.error(error);
      return HttpResponse.json(
        { error: 'Error retrieving experiments', status: 500 },
        { status: 500 }
      );
    }
  }),

  // POST /experiments
  http.post(`${API_BASE_URL}/experiments`, async ({ request }) => {
    try {
      const newExperiment = (await request.json()) as Experiment;
      const objectStore = await getObjectStore('experiments', 'readwrite');
      const addRequest = objectStore.add(newExperiment);
      const createdId = await getRequestResult(addRequest);
      return HttpResponse.json(createdId, { status: 201 });
    } catch (error) {
      console.error(error);
      return HttpResponse.json(
        { error: 'Error creating experiment', status: 500 },
        { status: 500 }
      );
    }
  }),

  // POST /draft-experiments
  http.post(`${API_BASE_URL}/draft-experiments`, async ({ request }) => {
    try {
      const newDraftExperiment = (await request.json()) as DraftExperiment;
      const objectStore = await getObjectStore(
        'draft-experiments',
        'readwrite'
      );
      const addRequest = objectStore.add(newDraftExperiment);
      const createdId = await getRequestResult(addRequest);
      return HttpResponse.json(createdId, { status: 201 });
    } catch (error) {
      console.error(error);
      return HttpResponse.json(
        { error: 'Error creating draft experiment', status: 500 },
        { status: 500 }
      );
    }
  }),

  // PATCH /draft-experiments
  http.patch(`${API_BASE_URL}/draft-experiments`, async ({ request }) => {
    try {
      const updatedData = (await request.json()) as DraftExperiment;
      const url = new URL(request.url);
      const draftExperimentId = url.searchParams.get('id');
      if (!draftExperimentId) {
        return HttpResponse.json(
          { message: 'ID is required', error: 'ID is required' },
          { status: 400 }
        );
      }

      const objectStore = await getObjectStore(
        'draft-experiments',
        'readwrite'
      );
      const getRequest = objectStore.get(Number(draftExperimentId));
      const existingData = await getRequestResult(getRequest);
      if (!existingData) {
        return HttpResponse.json(
          {
            error: 'Draft experiment not found',
            status: 404,
          },
          { status: 404 }
        );
      }
      const updatedDraftExperiment = { ...existingData, ...updatedData };
      const putRequest = objectStore.put(updatedDraftExperiment);
      await getRequestResult(putRequest);
      return HttpResponse.json(updatedDraftExperiment, { status: 200 });
    } catch (error) {
      console.error(error);
      return HttpResponse.json(
        { error: 'Error updating draft experiment', status: 500 },
        { status: 500 }
      );
    }
  }),

  // DELETE /draft-experiments
  http.delete(`${API_BASE_URL}/draft-experiments`, async ({ request }) => {
    try {
      const url = new URL(request.url);
      const draftExperimentId = url.searchParams.get('id');
      if (!draftExperimentId) {
        return HttpResponse.json(
          { error: 'ID is required', status: 400 },
          { status: 400 }
        );
      }

      const objectStore = await getObjectStore(
        'draft-experiments',
        'readwrite'
      );
      const deleteRequest = objectStore.delete(Number(draftExperimentId));
      await getRequestResult(deleteRequest);
      return HttpResponse.json(null, { status: 200 });
    } catch (error) {
      console.error(error);
      return HttpResponse.json(
        { error: 'Error deleting draft experiment', status: 500 },
        { status: 500 }
      );
    }
  }),
];
