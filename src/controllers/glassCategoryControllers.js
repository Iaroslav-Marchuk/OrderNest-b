import {
  addNewGlassCategoryService,
  deleteGlassCategoryService,
  getAllGlassCategoriesService,
  patchGlassCategoryService,
} from '../services/glassCategoryServices.js';

import { parseGlassCategoryFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllGlassCategoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, [
    'label',
    'createdAt',
  ]);

  const filter = parseGlassCategoryFilterParams(req.query);

  const allGlassCategories = await getAllGlassCategoriesService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    message: 'Glass categories found successfully!',
    data: allGlassCategories,
  });
};

export const addNewGlassCategoryController = async (req, res) => {
  const glassCategory = await addNewGlassCategoryService(req.body);

  res.status(201).json({
    message: 'New glass category added successfully!',
    data: { glassCategory },
  });
};

export const patchGlassCategoryController = async (req, res) => {
  const { glassCategoryId } = req.params;
  const updatedGlassCategory = await patchGlassCategoryService(
    glassCategoryId,
    req.body,
  );

  res.status(200).json({
    message: 'Glass category updated successfully',
    data: { updatedGlassCategory },
  });
};

export const deleteGlassCategoryController = async (req, res) => {
  const { glassCategoryId } = req.params;

  await deleteGlassCategoryService(glassCategoryId);

  res.status(204).end();
};
