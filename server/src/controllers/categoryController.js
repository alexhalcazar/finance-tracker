import category from "#models/categoryModel";

const getCategory = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { category_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        error: "User not authorzied",
      });
    }

    if (!category_id) {
      return res.status(404).json({
        error: "Category ID is required",
      });
    }

    const foundCategory = await category.findById(category_id);

    if (!foundCategory) {
      return res.status(404).json({
        message: "No found category for the category ID",
      });
    }

    return res.json({
      message: "Get category successfully",
      getCategory,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error trying to get the category",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { budget_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "User not authorized",
      });
    }

    const categories = await category.findAll(budget_id);

    if (!categories) {
      return res.status(404).json({
        message: "No categories found for the Budget ID",
      });
    }

    if (!budget_id) {
      return res.status(404).json({
        message: "Budget ID is requireds",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error trying to get all categories",
    });
  }
};

const createNewCategory = async (req, res) => {
  try {
    const { user_id } = req.user;
    const {};
  } catch (error) {
    return res.status(500).json({
      error: "Error trying to create new category",
    });
  }
};

export { getCategory, getAllCategories, createNewCategory };
