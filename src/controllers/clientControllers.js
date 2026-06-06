import {
  addNewClientService,
  deleteClientService,
  getAllClientsService,
  patchClientService,
} from '../services/clientServices.js';

export const getAllClientsController = async (req, res) => {
  const allClients = await getAllClientsService();

  res.status(200).json({
    message: 'Clients found successfully!',
    data: { allClients },
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
