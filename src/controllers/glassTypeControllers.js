import {
  addNewGlassTypeService,
  deleteGlassTypeService,
  getAllGlassTypesService,
  getGlassTypesListService,
  patchGlassTypeService,
} from '../services/glassTypesServices.js';
import { parseGlassTypeFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllGlassTypesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, [
    'label',
    'category',
    'createdAt',
  ]);

  const filter = parseGlassTypeFilterParams(req.query);

  const allGlassTypes = await getAllGlassTypesService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    message: 'Glass types found successfully!',
    data: allGlassTypes,
  });
};

export const getGlassTypesListController = async (req, res) => {
  const glassTypesList = await getGlassTypesListService();

  res.status(200).json({
    message: 'Glass Types List found successfully!',
    data: glassTypesList,
  });
};

export const addNewGlassTypeController = async (req, res) => {
  const glassType = await addNewGlassTypeService(req.body);

  res.status(201).json({
    message: 'New glass type added successfully!',
    data: { glassType },
  });
};

export const patchGlassTypeController = async (req, res) => {
  const { glassTypeId } = req.params;
  const updatedGlassType = await patchGlassTypeService(glassTypeId, req.body);

  res.status(200).json({
    message: 'Glass type updated successfully',
    data: { updatedGlassType },
  });
};

export const deleteGlassTypeController = async (req, res) => {
  const { glassTypeId } = req.params;

  await deleteGlassTypeService(glassTypeId);

  res.status(204).end();
};
