import createHttpError from 'http-errors';
import { ClientModel } from '../db/models/clientModel.js';

export const getAllClientsService = async () => {
  const clients = await ClientModel.find()
    .sort({ name: 1 })
    .collation({ locale: 'pt' })
    .exec();

  if (!clients || clients.length === 0) {
    throw createHttpError(404, 'Clients not found!');
  }

  return clients;
};

export const addNewClientService = async ({ name }) => {
  const existClient = await ClientModel.findOne({ name: name });

  if (existClient) throw createHttpError(409, 'Client already exists!');

  return await ClientModel.create({
    name,
  });
};

export const patchClientService = async (clientId, updateData) => {
  const client = await ClientModel.findByIdAndUpdate(clientId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!client) throw createHttpError(404, 'Client not found!');
  return client;
};

export const deleteClientService = async (clientId) => {
  const client = await ClientModel.findByIdAndDelete(clientId);
  if (!client) throw createHttpError(404, 'Client not found!');
};
