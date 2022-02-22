const sessionController = ( function() {
    const getSession = async (req, res) => {
        const user = await req.context.models.User.findById(
            req.context.me.id,
        );
        return res.send(user);
    }

    return { getSession }
})();

export default sessionController;