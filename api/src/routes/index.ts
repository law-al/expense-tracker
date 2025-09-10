import { Router } from 'express';
import authRoute from './auth.route.js';
import accountsRoute from './accounts.route.js';
import transactionsRoute from './transactions.route.js';
import categoryRoute from './category.route.js';
import budgetRoute from './budget.route.js';

const rootRoute = Router();

rootRoute.use('/auth', authRoute);
rootRoute.use('/accounts', accountsRoute);
rootRoute.use('/transactions', transactionsRoute);
rootRoute.use('/category', categoryRoute);
rootRoute.use('/budget', budgetRoute);

export default rootRoute;
