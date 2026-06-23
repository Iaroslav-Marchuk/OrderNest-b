import createHttpError from 'http-errors';

import { SORT_ORDER } from '../constants/constants.js';
import { ClientsCollection } from '../db/models/clientModel.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';

export const getAllClientsService = async ({
  page = 1,
  perPage = 20,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'createdAt',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const mongoFilter = {};

  if (filter.name) {
    mongoFilter.name = {
      $regex: filter.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }

  const clientsCount = await ClientsCollection.countDocuments(mongoFilter);

  const clients = await ClientsCollection.find(mongoFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();

  const paginationData = calculatePaginationData(clientsCount, page, perPage);

  return { clients, ...paginationData };
};

export const getClientsListService = async () => {
  const clientsList = await ClientsCollection.find().lean();

  return clientsList;
};

export const addNewClientService = async ({ name }) => {
  const existClient = await ClientsCollection.findOne({ name });

  if (existClient) throw createHttpError(409, 'Client already exists!');

  return await ClientsCollection.create({
    name,
  });
};

export const patchClientService = async (clientId, updateData) => {
  const client = await ClientsCollection.findByIdAndUpdate(
    clientId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!client) throw createHttpError(404, 'Client not found!');
  return client;
};

export const deleteClientService = async (clientId) => {
  const client = await ClientsCollection.findByIdAndDelete(clientId);
  if (!client) throw createHttpError(404, 'Client not found!');
};
