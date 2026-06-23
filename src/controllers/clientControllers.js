import {
  addNewClientService,
  deleteClientService,
  getAllClientsService,
  getClientsListService,
  patchClientService,
} from '../services/clientServices.js';
import { parseClientFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllClientsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, [
    'name',
    'createdAt',
  ]);
  const filter = parseClientFilterParams(req.query);

  const allClients = await getAllClientsService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    message: 'Clients found successfully!',
    data: allClients,
  });
};

export const getClientsListController = async (req, res) => {
  const clientsList = await getClientsListService();

  res.status(200).json({
    message: 'Clients List found successfully!',
    data: clientsList,
  });
};

export const addNewClientController = async (req, res) => {
  const client = await addNewClientService(req.body);

  res.status(201).json({
    message: 'New client added successfully!',
    data: { client },
  });
};

export const patchClientController = async (req, res) => {
  const { clientId } = req.params;
  const updatedClient = await patchClientService(clientId, req.body);

  res.status(200).json({
    message: 'Client updated successfully',
    data: { updatedClient },
  });
};

export const deleteClientController = async (req, res) => {
  const { clientId } = req.params;

  await deleteClientService(clientId);

  res.status(204).end();
};
