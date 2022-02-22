import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes';
import models, { connectDb } from './models';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(async (req, res, next) => {
    req.context = {
        models,
        me: await models.User.findByLogin('rwieruch'),
    };
    next();
});

app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

// A 301 HTTP status code always indicates a redirect and Express' redirect method lets us perform this redirect programmatically.
// Generalize for all routes that are not matched by the API
// Make sure it is the last route
app.get('*', function (req, res, next) {
    // make our error middleware handle the error
    const error = new Error(
        `${req.ip} tried to access ${req.originalUrl}`,
    );

    error.statusCode = 301;
    next(error);
})

// express handles any route with four arguments as error handling middleware
// important to put the use statement after the REST API routes, because only this way all the errors
// happening in your rest API end points can be deleggated to this error handling middleware
app.use((error, req, res, next) => {
    // set the default status code if none is available
    if (!error.statusCode) error.statusCode = 500;

    // special case of status code 301, perform a redirecting response
    if (error.statusCode == 301) {
        return res.status(301).redirect('/not-found');
    }

    return res
        .status(error.statusCode)
        .json({ error: error.toString });
})

const eraseDatabaseOnSync = true;

connectDb().then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
            models.Message.deleteMany({}),
        ]);

        createUsersWithMessages();
        console.log('initialized db');
    }

    app.listen(process.env.PORT, () =>
        console.log(`Example app listening on port ${process.env.PORT}`)
    );
});

const createUsersWithMessages = async () => {
    const user1 = new models.User({
        username: 'rwieruch',
    });

    const user2 = new models.User({
        username: 'ddavids',
    });
    
    const message1 = new models.Message({
        text: 'Published the Road to learn React',
        user: user1.id,
    });

    const message2 = new models.Message({
        text: 'Happy to release ...',
        user: user2.id,
    });
    
    const message3 = new models.Message({
        text: 'Published a complete ...',
        user: user2.id,
    });
    
    await message1.save();
    await message2.save();
    await message3.save();
    await user1.save();
    await user2.save();
};

