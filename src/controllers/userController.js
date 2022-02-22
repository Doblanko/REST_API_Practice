const userController = (function () {
    const getAllUsers = async (req, res) => {
        const users = await req.context.models.User.find()
        return res.send(users)
    }
    
    const getUser = async (req, res) => {
        const user = await req.context.models.User.findById(
          req.params.userId,
        )
        return res.send(user);
    }

    return { getAllUsers, getUser }
})();

export default userController;