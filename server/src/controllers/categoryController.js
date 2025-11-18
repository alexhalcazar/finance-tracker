import category from "#models/categoryModel";

const getCategory = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { category_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "User not authorzied",
      });
    }

    if (!category_id) {
      return res.status(400).json({
        message: "Category ID is required",
      });
    }

    const foundCategory = await category.findById(category_id);

    if (!foundCategory) {
      return res.status(404).json({
        message: "No found category for the category ID",
      });
    }

    return res.status(200).json({
      message: "Category retrieved successfully",
      foundCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to get the category",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { budget_id } = req.params;

    // handle user not found
    if (!user_id) {
      return res.status(400).json({
        message: "User not authorized",
      });
    }

    // handle no budget id in params
    if (!budget_id) {
      return res.status(404).json({
        message: "Budget ID params is required",
      });
    }

    // handle categories that do exist
    const categories = await category.findAll(budget_id);

    if (!categories) {
      return res.status(404).json({
        message: "No categories found for the Budget ID",
      });
    }

    return res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to get all categories",
    });
  }
};

const createNewCategory = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { budget_id, name, type, limit, color } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "User not authorized",
      });
    }

    if (!budget_id || !name) {
      return res.status(401).json({
        message: "Budget id and name of category is required",
      });
    }

    // Handle if there is already an existing category to throw an error
    const existingCategory = await category.findByType(budget_id, type);

    if (existingCategory) {
      return res.status(409).json({
        message: "Existing category with the same budget id and category type",
      });
    }

    //  Handle inserting new category
    const newCategory = {
      budget_id,
      name,
      type,
      limit,
      color,
    };

    const createNewCategory = await category.insert(newCategory);

    if (!createNewCategory) {
      return res.status(400).json({
        message: "Error trying to create new category",
      });
    }

    return res.status(201).json({
      message: "Categories created successfully",
      createNewCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to create new category",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { category_id } = req.params;
    const { name, type, limit, color, budget_id } = req.body;

    // handle params and body are passed in
    if (!user_id) {
      return res.status(400).json({
        message: "User not authorized",
      });
    }

    if (!category_id) {
      return res.status(404).json({
        message: "No category ID found",
      });
    }

    //  Handle if an existing category exists
    const existingCategory = await category.findById(category_id);

    if (!existingCategory) {
      return res.status(401).json({
        message: "No category found with existing category id",
      });
    }

    const updates = { name, type, limit, color, budget_id };

    const updatedCategory = await category.update(category_id, updates);

    if (!updatedCategory) {
      return res.status(401).json({
        message: "Category update failed",
      });
    }

    return res.status(201).json({
      message: "Category update succesful",
      updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to update existing category",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { category_id } = req.params;

    //  Handle no found user
    if (!user_id) {
      return res.status(400).json({
        message: "User not authorized",
      });
    }

    //  handle no existing categories
    const existingCategory = await category.findById(category_id);

    if (!existingCategory) {
      return res.status(404).json({
        message: "No existing category for the category ID",
      });
    }

    const deleteCategory = await category.delete(category_id);
    return res.status(200).json({
      message: "Successfully deleted category",
      deleteCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error trying to delete category",
    });
  }
};

export {
  getCategory,
  getAllCategories,
  createNewCategory,
  updateCategory,
  deleteCategory,
};
