import { BadRequestError } from '../utils/error';

// module pattern
const messageController = (function() {

    const getAllMessages = async (req, res) => {
        const messages = await req.context.models.Message.find()
        return res.send(messages)
    }

    const getMessage = async (req, res) => {
        const message = await req.context.models.Message.findById(
          req.params.messageId,
        );
        return res.send(message);
    }

    const createMessage = async (req, res, next) => {
        const message = await req.context.models.Message.create({
          text: req.body.text,
          user: req.context.me.id,
        }).catch( (error ) => { // need to use catch and pass the error to next so it will make it to the error handling function
          next( new BadRequestError(error) )
        }); 
      
        return res.send(message);
    }

    const deleteMessage = async (req, res) => {
        const message = await req.context.models.Message.findById(req.params.messageId);
        if (message) {
          await message.remove()
        };
        return res.send(message);
    }

    return { getAllMessages, getMessage, createMessage, deleteMessage } // modern object definition. No need for { getMessages: getMessages }
})();

export default messageController;