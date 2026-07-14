import { Router, type IRouter } from "express";
import healthRouter from "./health";
import adminAuthRouter from "./admin/index";
import adminPropertiesRouter from "./admin/properties";
import adminContactsRouter from "./admin/contacts";
import publicPropertiesRouter from "./publicProperties";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(adminPropertiesRouter);
router.use(adminContactsRouter);
router.use(publicPropertiesRouter);

export default router;
